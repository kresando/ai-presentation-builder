import React from 'react';
import { SlideElementData, ElementType, ChartData, TableData } from '@/db/schema/presentations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ElementRendererProps {
  element: SlideElementData;
  isEditing?: boolean;
  onUpdate?: (elementId: string, updates: Partial<SlideElementData>) => void;
  slideWidth: number;
  slideHeight: number;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isEditing = false,
  onUpdate,
  slideWidth,
  slideHeight,
}) => {
  const { type, content, position, styling } = element;

  const handleClick = () => {
    if (isEditing && onUpdate) {
      // Handle element selection for editing
    }
  };

  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x * slideWidth}px`,
    top: `${position.y * slideHeight}px`,
    width: `${position.width * slideWidth}px`,
    height: `${position.height * slideHeight}px`,
    fontSize: styling?.fontSize ? `${styling.fontSize}px` : undefined,
    fontFamily: styling?.fontFamily || 'Inter',
    fontWeight: styling?.fontWeight,
    color: styling?.color,
    backgroundColor: styling?.backgroundColor,
    border: styling?.borderWidth ? `${styling.borderWidth}px solid ${styling.borderColor}` : undefined,
    borderRadius: styling?.borderRadius ? `${styling.borderRadius}px` : undefined,
    textAlign: styling?.textAlign as any,
    lineHeight: styling?.lineHeight,
    letterSpacing: styling?.letterSpacing,
    opacity: styling?.opacity,
    transform: styling?.rotation ? `rotate(${styling.rotation}deg)` : undefined,
    cursor: isEditing ? 'pointer' : 'default',
    zIndex: element.zIndex || 0,
  };

  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <div style={elementStyle} onClick={handleClick}>
            {content.text || (isEditing ? 'Click to edit text' : '')}
          </div>
        );

      case 'heading':
        return (
          <h1
            style={{
              ...elementStyle,
              margin: 0,
              fontWeight: styling?.fontWeight || 'bold',
            }}
            onClick={handleClick}
          >
            {content.text || (isEditing ? 'Click to edit heading' : '')}
          </h1>
        );

      case 'subheading':
        return (
          <h2
            style={{
              ...elementStyle,
              margin: 0,
              fontWeight: styling?.fontWeight || '600',
            }}
            onClick={handleClick}
          >
            {content.text || (isEditing ? 'Click to edit subheading' : '')}
          </h2>
        );

      case 'bullet':
        return (
          <div style={elementStyle} onClick={handleClick}>
            {content.bulletPoints?.map((point, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ marginRight: '8px' }}>•</span>
                <span>{point}</span>
              </div>
            )) || (isEditing ? 'Click to add bullet points' : '')}
          </div>
        );

      case 'image':
        return (
          <div style={elementStyle} onClick={handleClick}>
            {content.imageUrl ? (
              <img
                src={content.imageUrl}
                alt={content.altText || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: styling?.objectFit || 'cover',
                  borderRadius: styling?.borderRadius ? `${styling.borderRadius}px` : undefined,
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '2px dashed #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  borderRadius: styling?.borderRadius ? `${styling.borderRadius}px` : undefined,
                }}
              >
                {isEditing ? 'Click to add image' : 'No image'}
              </div>
            )}
          </div>
        );

      case 'chart':
        return (
          <div style={elementStyle} onClick={handleClick}>
            {content.chartData ? (
              <ResponsiveChartRenderer
                chartType={content.chartType || 'bar'}
                data={content.chartData}
                width={position.width * slideWidth}
                height={position.height * slideHeight}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '2px dashed #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  borderRadius: styling?.borderRadius ? `${styling.borderRadius}px` : undefined,
                }}
              >
                {isEditing ? 'Click to add chart data' : 'No chart data'}
              </div>
            )}
          </div>
        );

      case 'table':
        return (
          <div style={elementStyle} onClick={handleClick}>
            {content.tableData ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {content.tableData.headers.map((header, index) => (
                      <th
                        key={index}
                        style={{
                          border: '1px solid #e5e7eb',
                          padding: '8px',
                          backgroundColor: '#f9fafb',
                          fontWeight: '600',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.tableData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            border: '1px solid #e5e7eb',
                            padding: '8px',
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '2px dashed #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  borderRadius: styling?.borderRadius ? `${styling.borderRadius}px` : undefined,
                }}
              >
                {isEditing ? 'Click to add table data' : 'No table data'}
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div style={elementStyle} onClick={handleClick}>
            <blockquote
              style={{
                margin: 0,
                paddingLeft: '20px',
                borderLeft: `4px solid ${styling?.color || '#3b82f6'}`,
                fontStyle: 'italic',
                fontSize: styling?.fontSize ? `${styling.fontSize * 1.2}px` : undefined,
              }}
            >
              {content.text || (isEditing ? 'Click to add quote' : '')}
            </blockquote>
          </div>
        );

      case 'shape':
        return (
          <div
            style={{
              ...elementStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: styling?.backgroundColor || '#e5e7eb',
              borderRadius: styling?.borderRadius ? `${styling.borderRadius}px` : undefined,
            }}
            onClick={handleClick}
          >
            {content.text || '→'}
          </div>
        );

      case 'code':
        return (
          <div style={elementStyle} onClick={handleClick}>
            <pre
              style={{
                margin: 0,
                padding: '12px',
                backgroundColor: '#1f2937',
                color: '#f3f4f6',
                borderRadius: '8px',
                fontSize: styling?.fontSize ? `${styling.fontSize * 0.9}px` : '14px',
                fontFamily: 'monospace',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              <code>{content.code || (isEditing ? '// Click to add code' : '')}</code>
            </pre>
          </div>
        );

      default:
        return (
          <div style={elementStyle} onClick={handleClick}>
            {content.text || `Unsupported element type: ${type}`}
          </div>
        );
    }
  };

  return renderContent();
};

interface ResponsiveChartRendererProps {
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  data: ChartData;
  width: number;
  height: number;
}

const ResponsiveChartRenderer: React.FC<ResponsiveChartRendererProps> = ({
  chartType,
  data,
  width,
  height,
}) => {
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const chartData = data.labels.map((label, index) => {
    const point: any = { name: label };
    data.datasets.forEach((dataset) => {
      point[dataset.label] = dataset.data[index];
    });
    return point;
  });

  switch (chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width={width} height={height}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {data.datasets.map((dataset, index) => (
              <Bar
                key={dataset.label}
                dataKey={dataset.label}
                fill={dataset.backgroundColor?.[index] || COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case 'line':
      return (
        <ResponsiveContainer width={width} height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {data.datasets.map((dataset, index) => (
              <Line
                key={dataset.label}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.borderColor || COLORS[index % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width={width} height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={Math.min(width, height) / 3}
              fill="#8884d8"
              dataKey={data.datasets[0]?.label || 'value'}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
          }}
        >
          Chart type "{chartType}" not supported yet
        </div>
      );
  }
};