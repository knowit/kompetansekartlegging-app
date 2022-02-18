import React from "react";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    withStyles,
    makeStyles,
} from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

import { KnowitColors } from "../styles";
import { CustomScaleChartProps } from "../types";

const numTicks = 5;
const heightPerColumn = 50;

const useStyles = makeStyles({
    tooltipRoot: {
        backgroundColor: KnowitColors.white,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: KnowitColors.darkBrown,
        minWidth: "400px",
    },
    tooltipLabel: {
        fill: KnowitColors.darkBrown,
        fontFamily: "Arial",
        fontSize: "16px",
        fontWeight: "bold",
        textAnchor: "start",
        opacity: 1,
    },
    answer: {
        color: KnowitColors.darkGreen,
        fontSize: "13px",
        fontWeight: "bold",
    },
    popupSlider: { padding: "10px" },
    popupLabels: {
        margin: "0 0 10px 0",
        display: "flex",
        justifyContent: "space-between",
    },
    popupLabel: {
        fontSize: "0.75rem",
        textAlign: "center",
    },
    chartContainer: {
        width: "100%",
        maxWidth: 1200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "15px",
    },
    "@global": {
        "g.recharts-cartesian-grid-horizontal > line:last-child": {
            display: "none",
        },
        "g.recharts-cartesian-grid-horizontal > line:nth-last-child(2)": {
            display: "none",
        },
        "g.recharts-cartesian-grid-vertical > line:last-child": {
            display: "none",
        },
    },
});

const PopupSlider = withStyles({
    mark: {
        backgroundColor: "#bfbfbf",
        height: 8,
        width: 1,
        marginTop: -3,
    },
    markActive: {
        opacity: 1,
        backgroundColor: "currentColor",
    },
})(Slider);

export const CustomScaleChart = ({ ...props }: CustomScaleChartProps) => {
    let classes = useStyles();

    if (props.chartData.length === 0) return null;

    const RenderCustomTooltip = (classes: any) => {
        return ({ ...props }: ToolTipProps) => {
            if (props.active && props.payload) {
                const value = props.payload[0]?.payload.value.toFixed(1);
                const marks = new Array(11).fill(undefined).map((_v, i) => {
                    return { value: i * 0.5, label: "" };
                });
                marks[0].label = "0"
                marks[5].label = "2.5"
                marks[10].label = "5.0"
                const startLabel = props.payload[0]?.payload.startLabel;
                const middleLabel = props.payload[0]?.payload.middleLabel;
                const endLabel = props.payload[0]?.payload.endLabel;

                return (
                    <div className={classes.tooltipRoot}>
                        <p className={classes.tooltipLabel}>{props.label}</p>
                        <div className={classes.popupSlider}>
                            <div className={classes.popupLabels}>
                                <span className={classes.popupLabel}>
                                    {startLabel}
                                </span>
                                <span className={classes.popupLabel}>
                                    {middleLabel}
                                </span>
                                <span className={classes.popupLabel}>
                                    {endLabel}
                                </span>
                            </div>
                            <PopupSlider
                                value={value}
                                step={0.125}
                                marks={marks}
                                min={0}
                                max={5}
                                disabled
                            />
                        </div>
                        <p className={classes.answer}>Svar: {value}</p>
                    </div>
                );
            }
            return null;
        };
    };

    return (
        <div className={classes.chartContainer}>
            <ResponsiveContainer
                width="100%"
                height={heightPerColumn * props.chartData.length + 90}
            >
                <BarChart
                    barGap={-15}
                    barSize={15}
                    maxBarSize={15}
                    layout="vertical"
                    data={props.chartData}
                    margin={{ top: 50, right: 50, bottom: 6, left: 50 }}
                >
                    <CartesianGrid
                        horizontal={true}
                        vertical={true}
                        strokeDasharray="2 5"
                    />
                    <XAxis
                        tickLine={false}
                        axisLine={false}
                        orientation="top"
                        dataKey="value"
                        type="number"
                        padding={{ left: 0, right: 20 }}
                        domain={[0, numTicks]}
                        ticks={[0, 1, 2, 3, 4, 5]}
                    />
                    <YAxis
                        width={200}
                        dataKey="name"
                        type="category"
                        interval={0}
                        tick={{ fill: KnowitColors.darkBrown }}
                    />
                    <Tooltip
                        content={RenderCustomTooltip(classes)}
                        cursor={{ fill: KnowitColors.ecaluptus, opacity: 0.3 }}
                    />
                    <Bar
                        radius={[0, 10, 10, 0]}
                        dataKey="value"
                        fill={KnowitColors.darkGreen}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

type ToolTipProps = {
    className: string;
    active: boolean;
    payload: any;
    label: any;
};
