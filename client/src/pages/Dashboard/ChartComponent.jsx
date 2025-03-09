export const BarChart = ({ data, index, categories, colors, valueFormatter, className, layout }) => {
  return (
    <div className={className}>
      <div className="flex flex-col h-full justify-center items-center">
        <div className="text-lg font-medium mb-2">Bar Chart</div>
        <div className="w-full flex flex-col gap-2">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm">{item[index]}</span>
                <span className="text-sm font-medium">
                  {valueFormatter ? valueFormatter(item[categories[0]]) : item[categories[0]]}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(100, item[categories[0]])}%`, // Fix string interpolation here
                    backgroundColor: colors[0],
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LineChart = ({ data, index, categories, colors, valueFormatter, className }) => {
  const maxValue = Math.max(...data.map((item) => item[categories[0]]));
  return (
    <div className={className}>
      <div className="flex flex-col h-full justify-center items-center">
        <div className="text-lg font-medium mb-2">Line Chart</div>
        <div className="w-full h-full flex items-end justify-between gap-1 pt-10 relative">
          <div className="absolute left-0 top-0 text-xs text-gray-500">
            {valueFormatter ? valueFormatter(maxValue) : maxValue}
          </div>
          {data.map((item, i) => {
            const height = (item[categories[0]] / maxValue) * 100;
            return (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className="w-2 rounded-t-full"
                  style={{
                    height: `${height}%`, // Fix string interpolation here
                    backgroundColor: colors[0],
                    minHeight: "4px",
                  }}
                ></div>
                <div className="text-xs mt-1 truncate w-full text-center">{item[index]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const PieChart = ({ data, index, category, valueFormatter, colors, className }) => {
  const total = data.reduce((sum, item) => sum + item[category], 0);
  return (
    <div className={className}>
      <div className="flex flex-col h-full justify-center items-center">
        <div className="text-lg font-medium mb-4">Pie Chart</div>
        <div className="grid grid-cols-1 gap-2 w-full">
          {data.map((item, i) => (
            <div key={i} className="flex items-center">
              <div
                className="w-4 h-4 rounded-sm mr-2"
                style={{ backgroundColor: colors[i % colors.length] }}
              ></div>
              <div className="flex-1 text-sm">{item[index]}</div>
              <div className="text-sm font-medium">
                {valueFormatter ? valueFormatter(item[category]) : item[category]}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-1 h-6 w-full rounded-full overflow-hidden">
          {data.map((item, i) => {
            const width = (item[category] / total) * 100;
            return (
              <div
                key={i}
                style={{
                  width: `${width}%`, // Fix string interpolation here
                  backgroundColor: colors[i % colors.length],
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const DonutChart = ({ data, index, category, valueFormatter, colors, className }) => {
  const total = data.reduce((sum, item) => sum + item[category], 0);
  return (
    <div className={className}>
      <div className="flex flex-col h-full justify-center items-center">
        <div className="text-lg font-medium mb-4">Donut Chart</div>
        <div className="grid grid-cols-1 gap-2 w-full">
          {data.map((item, i) => (
            <div key={i} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: colors[i % colors.length] }}
              ></div>
              <div className="flex-1 text-sm">{item[index]}</div>
              <div className="text-sm font-medium">
                {valueFormatter ? valueFormatter(item[category]) : item[category]}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-1 h-6 w-full rounded-full overflow-hidden">
          {data.map((item, i) => {
            const width = (item[category] / total) * 100;
            return (
              <div
                key={i}
                style={{
                  width: `${width}%`, // Fix string interpolation here
                  backgroundColor: colors[i % colors.length],
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
