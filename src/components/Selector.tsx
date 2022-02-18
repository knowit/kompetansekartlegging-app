import React from "react";

type Props = {
    radiobuttonChanged: (value: number, motivation: boolean) => void;
    questionId: string;
    motivation: boolean;
    checked: number;
};

const Selector = ({ ...props }: Props) => {
    const radiobuttonChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.radiobuttonChanged(
            parseInt(event.target.value),
            props.motivation
        );
    };

    return (
        <div onChange={radiobuttonChanged}>
            {[0, 1, 2, 3, 4, 5].map((v) => (
                <input
                    key={v}
                    type="radio"
                    id={String(v)}
                    defaultChecked={v === props.checked}
                    name={
                        props.motivation
                            ? "mot_" + props.questionId
                            : props.questionId
                    }
                    value={v}
                />
            ))}
        </div>
    );
};

export default Selector;
