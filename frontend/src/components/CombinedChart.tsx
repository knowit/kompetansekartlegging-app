import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Label,
    ResponsiveContainer,
    ReferenceLine,
    TooltipProps
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { GetIcon } from "../icons/iconController";
import { KnowitColors } from "../styles";
import { CombinedChartProps } from "../types";
import { OverviewType } from "./TypedOverviewChart";

const numTicks = 5;
const chartSplitAt = numTicks + 2;
const heightPerColumn = 50;

const useStyles = makeStyles({
    tooltipRoot: {
        backgroundColor: KnowitColors.white,
        paddingLeft: 10,
        paddingRight: 10,
        opacity: 0.9,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: KnowitColors.darkBrown,
    },
    label: {
        fill: KnowitColors.darkBrown,
        fontFamily: "Arial",
        fontSize: "20px",
        fontWeight: "bold",
        textAnchor: "start",
        opacity: 1,
    },
    tooltipLabel: {
        fill: KnowitColors.darkBrown,
        fontFamily: "Arial",
        fontSize: "16px",
        fontWeight: "bold",
        textAnchor: "start",
        opacity: 1,
    },
    knowledge: {
        color: KnowitColors.darkGreen,
        fontSize: "13px",
        fontWeight: "bold",
    },
    motivation: {
        color: KnowitColors.greyGreen,
        fontSize: "13px",
        fontWeight: "bold",
    },
    combinedChartContainer: {
        width: "100%",
        maxWidth: 1200,
        // height: '100%',
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

const getLabel = (
    isTop: any,
    topGetFn: () => any,
    defaultValue: string
): string => {
    if (isTop) {
        return topGetFn();
    }

    return defaultValue;
};

export const CombinedChart = ({ ...props }: CombinedChartProps) => {
    const { t } = useTranslation();

    let classes = useStyles();

    if (props.chartData.length === 0) return null;

    const RenderCustomTooltip = (classes: any) => {
        const validate = (msg: string | undefined) => {
            if (msg === "") return t("notAnswered");
            else return msg;
        };
        let isTop = props.type === OverviewType.HIGHEST && props.topSubjects;
        let topSubjects = props.topSubjects;
        return ({ ...props }: TooltipProps<ValueType, NameType>) => {
            if (props.active && props.payload) {
                let knowledgeValue =
                    props.payload[0]?.payload.valueKnowledge[1].toFixed(1);
                let motivationValue = (
                    props.payload[1]?.payload.valueMotivation[1] - chartSplitAt
                ).toFixed(1);
                const knowledgeLabel = getLabel(
                    isTop,
                    () => validate(topSubjects?.get(props.label)?.kTop),
                    t("knowledge")
                );
                const motivationLabel = getLabel(
                    isTop,
                    () => validate(topSubjects?.get(props.label)?.mTop),
                    t("motivation")
                );

                return (
                    <div className={classes.tooltipRoot}>
                        <p className={classes.tooltipLabel}>{props.label}</p>
                        <p className={classes.knowledge}>
                            {knowledgeLabel}: {knowledgeValue}
                        </p>
                        <p className={classes.motivation}>
                            {motivationLabel}: {motivationValue}
                        </p>
                    </div>
                );
            }
            return null;
        };
    };

    return (
        <div className={classes.combinedChartContainer}>
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
                        domain={[0, chartSplitAt + numTicks]}
                        ticks={[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]}
                        tick={renderCustomAxisTicks()}
                    />
                    <YAxis
                        width={200}
                        dataKey="name"
                        type="category"
                        interval={0}
                        tick={{ fill: KnowitColors.darkBrown }}
                    />
                    <Tooltip
                        wrapperStyle={{ outline: "none" }}
                        content={RenderCustomTooltip(classes)}
                        cursor={{ fill: KnowitColors.ecaluptus, opacity: 0.3 }}
                    />
                    <Bar
                        radius={[0, 10, 10, 0]}
                        dataKey="valueKnowledge"
                        fill={KnowitColors.darkGreen}
                    />
                    <Bar
                        radius={[0, 10, 10, 0]}
                        dataKey="valueMotivation"
                        fill={KnowitColors.lightGreen}
                    />
                    <ReferenceLine x={0} stroke={KnowitColors.darkGreen}>
                        <Label
                            className={classes.label}
                            position="top"
                            offset={50}
                        >
                            {t("knowledge").toUpperCase()}
                        </Label>
                    </ReferenceLine>
                    <ReferenceLine
                        x={chartSplitAt}
                        stroke={KnowitColors.darkGreen}
                    >
                        <Label
                            className={classes.label}
                            position="top"
                            offset={50}
                        >
                            {t("motivation").toUpperCase()}
                        </Label>
                    </ReferenceLine>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const renderCustomAxisTicks = () => {
    return ({ ...props }: TickProps) => {
        let isKnowledge = true;
        let iconNumber = props.payload.value;
        if (props.payload.value >= chartSplitAt) {
            iconNumber -= chartSplitAt;
            isKnowledge = false;
        }
        return (
            <foreignObject
                x={props.x - 12}
                y={props.y - 24}
                width={24}
                height={24}
                style={{ color: KnowitColors.darkBrown }}
            >
                {GetIcon(isKnowledge, Math.round(iconNumber))};
            </foreignObject>
        );
    };
};

type TickProps = {
    knowledge: boolean;
    x: number;
    y: number;
    payload: {
        value: any;
    };
};
