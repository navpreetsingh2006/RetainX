import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// ML chart generation – analyzes dataset and generates chart configs
function generateChartConfigs(data: Record<string, unknown>[]): Array<{type: string; config: object}> {
  if (!Array.isArray(data) || data.length === 0) return [];

  const keys = Object.keys(data[0]);
  const numericKeys = keys.filter(k => typeof data[0][k] === 'number');
  const labelKey = keys.find(k => typeof data[0][k] === 'string') ?? keys[0];
  const charts: Array<{type: string; config: object}> = [];

  // Auto-generate bar chart for first 2 numeric fields
  if (numericKeys.length >= 1) {
    charts.push({
      type: 'bar',
      config: {
        title: `${numericKeys[0]} by ${labelKey}`,
        labels: data.slice(0, 20).map(r => String(r[labelKey])),
        datasets: numericKeys.slice(0, 2).map((k, i) => ({
          label: k,
          data: data.slice(0, 20).map(r => Number(r[k])),
          backgroundColor: i === 0 ? 'rgba(99,102,241,0.8)' : 'rgba(34,211,238,0.8)',
        })),
      },
    });
  }

  // Line chart
  if (numericKeys.length >= 1) {
    charts.push({
      type: 'line',
      config: {
        title: `${numericKeys[0]} Trend`,
        labels: data.slice(0, 20).map(r => String(r[labelKey])),
        datasets: [{
          label: numericKeys[0],
          data: data.slice(0, 20).map(r => Number(r[numericKeys[0]])),
          borderColor: 'rgba(99,102,241,1)',
          backgroundColor: 'rgba(99,102,241,0.1)',
          tension: 0.4,
          fill: true,
        }],
      },
    });
  }

  // Pie chart – distribution for first numeric key
  if (numericKeys.length >= 1 && data.length <= 10) {
    charts.push({
      type: 'pie',
      config: {
        title: `${numericKeys[0]} Distribution`,
        labels: data.map(r => String(r[labelKey])),
        datasets: [{
          data: data.map(r => Number(r[numericKeys[0]])),
          backgroundColor: [
            '#6366f1','#22d3ee','#a78bfa','#34d399','#f472b6',
            '#fbbf24','#ef4444','#3b82f6','#10b981','#f97316',
          ],
        }],
      },
    });
  }

  return charts;
}

// POST /api/charts/generate – ML auto-generate charts from a dataset
export async function POST(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const payload = auth ? verifyToken(auth.replace('Bearer ', '')) : null;
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { datasetId } = await request.json();
  if (!datasetId) return NextResponse.json({ message: 'datasetId is required' }, { status: 400 });

  const dataset = await prisma.dataset.findFirst({
    where: { id: Number(datasetId), userId: payload.sub },
  });
  if (!dataset) return NextResponse.json({ message: 'Dataset not found' }, { status: 404 });

  const data = dataset.dataJson as Record<string, unknown>[];
  const chartConfigs = generateChartConfigs(data);

  // Delete old charts for this dataset and create new ones
  await prisma.chart.deleteMany({ where: { datasetId: Number(datasetId) } });

  const charts = await Promise.all(
    chartConfigs.map(c =>
      prisma.chart.create({
        data: {
          datasetId: Number(datasetId),
          type: c.type,
          configJson: c.config as object,
        },
      })
    )
  );

  return NextResponse.json({ success: true, charts });
}
