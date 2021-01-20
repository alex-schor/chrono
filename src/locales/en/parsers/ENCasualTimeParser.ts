import { ParsingContext } from "../../../chrono";
import { Meridiem } from "../../../index";
import { AbstractParserWithWordBoundaryChecking } from "../../../common/parsers/AbstractParserWithWordBoundary";
import dayjs from "dayjs";
import { assignTheNextDay } from "../../../utils/dayjs";

export default class ENCasualTimeParser extends AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return /(?:this)?\s*(morning|afternoon|evening|night|midnight|noon)(?=\W|$)/i;
    }

    innerExtract(context: ParsingContext, match: RegExpMatchArray) {
        const targetDate = dayjs(context.refDate);
        const component = context.createParsingComponents();

        switch (match[1].toLowerCase()) {
            case "afternoon":
                component.assignStr("timePeriod", "afternoon");
                component.imply("meridiem", Meridiem.PM);
                component.imply("hour", 15);
                break;

            case "evening":
                component.assignStr("timePeriod", "evening");
            /* falls through */
            case "night":
                component.assignStr("timePeriod", "night");
                component.imply("meridiem", Meridiem.PM);
                component.imply("hour", 20);
                break;

            case "midnight":
                component.assignStr("timePeriod", "midnight");
                assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;

            case "morning":
                component.assignStr("timePeriod", "morning");
                component.imply("meridiem", Meridiem.AM);
                component.imply("hour", 6);
                break;

            case "noon":
                component.assignStr("timePeriod", "noon");
                component.imply("meridiem", Meridiem.AM);
                component.imply("hour", 12);
                break;
        }

        return component;
    }
}
