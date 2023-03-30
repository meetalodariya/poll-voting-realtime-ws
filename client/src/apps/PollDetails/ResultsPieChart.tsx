import React, { FC } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Option } from 'src/types';

ChartJS.register(ArcElement, Tooltip, Legend);

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const getChartData = (data: Partial<Option>[]) => {
  const { labels, votes, backgroundColor } = data.reduce(
    (acc, val) => {
      acc.labels.push(val.title);
      acc.votes.push(val.votes);
      acc.backgroundColor.push(getRandomColor());

      return acc;
    },
    { labels: [], votes: [], backgroundColor: [] },
  );

  return {
    labels,
    datasets: [
      {
        label: '# of Votes',
        data: votes,
        borderWidth: 1,
        backgroundColor,
      },
    ],
  };
};

interface Props {
  data: Partial<Option>[];
}

const ResultsPieChart: FC<Props> = ({ data }) => {
  const chartData = getChartData(data);

  return <Pie data={chartData} options={{ color: 'random' }} />;
};

export default ResultsPieChart;
