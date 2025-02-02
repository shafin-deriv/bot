import { localize } from '@deriv-com/translations';
import { emptyTextValidator } from '../../utils';

window.Blockly.Blocks.text_changeCase = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Transform {{ input_text }} to {{ transform_type }}', {
                input_text: '%1',
                transform_type: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
                {
                    type: 'field_dropdown',
                    name: 'CASE',
                    options: [
                        [localize('UPPER CASE'), 'UPPERCASE'],
                        [localize('lower case'), 'LOWERCASE'],
                        [localize('Title Case'), 'TITLECASE'],
                    ],
                },
            ],
            output: 'String',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Changes text case accordingly'),
            category: window.Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Change text case'),
            description: localize(
                'Changes the capitalisation of a string of text to Upper case, Lower case, Title case.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            TEXT: emptyTextValidator,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.text_changeCase = block => {
    const operators = {
        UPPERCASE: '.toUpperCase()',
        LOWERCASE: '.toLowerCase()',
        TITLECASE: null,
    };
    const operator = operators[block.getFieldValue('CASE')];
    const textOrder = operator
        ? window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER
        : window.Blockly.JavaScript.javascriptGenerator.ORDER_NONE;
    const text = window.Blockly.JavaScript.javascriptGenerator.valueToCode(block, 'TEXT', textOrder) || "''";

    let code;

    if (operator) {
        code = `${text}${operator}`;
    } else {
        // eslint-disable-next-line no-underscore-dangle
        const functionName = window.Blockly.JavaScript.javascriptGenerator.provideFunction_('textToTitleCase', [
            // eslint-disable-next-line no-underscore-dangle
            `function ${window.Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(str) {
                return str.toLowerCase().split(' ').map(function(word) {
                    return word.replace(word[0], word[0].toUpperCase());
                }).join(' ');
            }`,
        ]);
        code = `${functionName}(${text})`;
    }

    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
