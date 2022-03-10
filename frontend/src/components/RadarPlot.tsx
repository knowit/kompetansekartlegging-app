import React, { useEffect } from "react";
import { AggregatedAnswer, AnsweredQuestion } from "../types";

export default function RadarPlot(props: { data: AnsweredQuestion[] }) {
    let categoryAnswers: AggregatedAnswer[] = [];

    useEffect(() => {
        props.data.map((value) => {
            let category = categoryAnswers.find(
                (cat) => cat.category === value.question.category.text
            );
            if (!category) {
                category = {
                    category: value.question.category.text,
                    totalAnswerValue: 0,
                    numberOfAnswerValues: 0,
                    answerAverage: 0,
                    totalMotivationValue: 0,
                    numberOfMotivationValues: 0,
                    motivationAverage: 0,
                };
                categoryAnswers.push(category);
            }
            if (value.answer !== -1) {
                category.numberOfAnswerValues++;
                category.totalAnswerValue += value.answer;
                category.answerAverage =
                    category.totalAnswerValue / category.numberOfAnswerValues;
            }
            if (value.motivation !== -1) {
                category.numberOfMotivationValues++;
                category.totalMotivationValue += value.motivation;
                category.motivationAverage =
                    category.totalMotivationValue /
                    category.numberOfMotivationValues;
            }
        });
    }, [props.data]);

    return (
        <div></div>
        //     <ResponsiveRadar
        //     data={categoryAnswers}
        //     keys={['answerAverage', 'motivationAverage']}
        //     indexBy="category"
        //     maxValue={5}
        //     margin={{top: 70, right: 80, bottom: 40, left: 200}}
        //     curve="linearClosed"
        //     gridShape="linear"
        //     dotSize={10}
        //     enableDotLabel={true}
        //     colors={{scheme: 'nivo'}}
        //     blendMode="multiply"
        //     legends={[
        //         {
        //             anchor: 'top-left',
        //             direction: 'column',
        //             translateX: -50,
        //             translateY: -40,
        //             itemWidth: 80,
        //             itemHeight: 20,
        //             itemTextColor: '#999',
        //             symbolSize: 12,
        //             symbolShape: 'circle',
        //             effects: [
        //                 {
        //                     on: 'hover',
        //                     style: {
        //                         itemTextColor: '#000'
        //                     }
        //                 }
        //             ]
        //         }
        //     ]}
        // />
    );
}
