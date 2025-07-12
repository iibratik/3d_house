'use client';

import { useMemo, useRef } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export type TimeRange = 'Day' | 'Week' | 'Month';

interface ChartDataProps {
    value: TimeRange;
    labels: string[];
    viewsData: number[];
    favoritesData: number[];
    callsData: number[];
}

interface Props {
    chartData: ChartDataProps;
}

export default function ChartComponent({ chartData }: Props) {
    const chartRef = useRef(null);

    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    });

    const weekAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    });

    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    });

    const labelOutput = useMemo(() => {
        if (chartData.value === 'Day') return yesterday;
        if (chartData.value === 'Week') return `${weekAgo} - ${yesterday}`;
        if (chartData.value === 'Month') return `${lastMonth} - ${yesterday}`;
        return lastMonth;
    }, [chartData.value, lastMonth, weekAgo, yesterday]);

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Просмотры',
                data: chartData.viewsData,
                borderColor: 'Orange',
                borderWidth: 2,
                fill: false,
                pointBorderColor: 'Orange',
                pointBackgroundColor: 'Orange',
            },
            {
                label: 'Избранные',
                data: chartData.favoritesData,
                borderColor: 'red',
                borderWidth: 2,
                fill: false,
                pointBorderColor: 'red',
                pointBackgroundColor: 'red',
            },
            {
                label: 'Звонки',
                data: chartData.callsData,
                borderColor: '#14c74a',
                borderWidth: 2,
                fill: false,
                pointBorderColor: '#14c74a',
                pointBackgroundColor: '#14c74a',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'white',
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    boxWidth: 20,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white', // подписи по оси X
                },
                grid: {
                    color: '#444', // ← цвет вертикальной сетки
                },
                title: {
                    display: true,
                    text: labelOutput,
                    color: 'white', // заголовок по оси X
                },
            },
            y: {
                ticks: {
                    color: 'white', // подписи по оси Y
                },
                grid: {
                    color: '#444', // ← цвет вертикальной сетки
                },
                title: {
                    display: true,
                    text: 'Количество',
                    color: 'white', // заголовок по оси Y
                },
            },
        },
    };

    return (
        <div>
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
}
