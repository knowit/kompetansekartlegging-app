import React from "react";
import { YourAnswerProps } from "../../types";
import { YourAnswersMobile } from "../YourAnswersMobile";
import { YourAnswersDesktop } from "../YourAnswersDesktop";

export const YourAnswers = ({ ...props }: YourAnswerProps) =>
    props.isMobile ? (
        <YourAnswersMobile {...props} />
    ) : (
        <YourAnswersDesktop {...props} />
    );
