import { localize } from '@deriv-com/translations';
import { emptyTextValidator } from '../../utils';

window.Blockly.Blocks.text_charAt = {
    init() {
        this.jsonInit(this.definition());

        const dropdown = this.getField('WHERE');
        dropdown.setValidator(value => {
            const newAt = ['FROM_START', 'FROM_END'].includes(value);
            if (newAt !== this.isAt) {
                this.updateAt(newAt);
                this.setFieldValue(value, 'WHERE');
                return null;
            }
            return undefined;
        });

        this.updateAt(true);
    },
    definition() {
        return {
            message0: localize('in text %1 get %2'),
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
                {
                    type: 'field_dropdown',
                    name: 'WHERE',
                    options: [
                        [localize('letter #'), 'FROM_START'],
                        [localize('letter # from end'), 'FROM_END'],
                        [localize('first letter'), 'FIRST'],
                        [localize('last letter'), 'LAST'],
                        [localize('random letter'), 'RANDOM'],
                    ],
                },
            ],
            inputsInline: true,
            output: 'String',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns a specific character from a given string'),
            category: window.Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Get character'),
            description: localize(
                'Returns the specific character from a given string of text according to the selected option. '
            ),
        };
    },
    mutationToDom() {
        const container = document.createElement('mutation');
        container.setAttribute('at', !!this.isAt);
        return container;
    },
    domToMutation(xmlElement) {
        const isAt = xmlElement.getAttribute('at') !== 'false';
        this.updateAt(isAt);
    },
    updateAt(isAt) {
        this.removeInput('AT', true);
        if (isAt) {
            this.appendValueInput('AT').setCheck('Number');
        }

        this.isAt = isAt;
        this.initSvg();
        //commented this line breaks the backward compatibility
        //this.render(false);
    },
    getRequiredValueInputs() {
        return {
            VALUE: emptyTextValidator,
            AT: emptyTextValidator,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.text_charAt = block => {
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const textOrder =
        where === 'RANDOM'
            ? window.Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            : window.Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
    const text = window.Blockly.JavaScript.javascriptGenerator.valueToCode(block, 'VALUE', textOrder) || "''";

    let code;

    if (where === 'FROM_START') {
        const at = window.Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT');
        // Adjust index if using one-based indices
        code = `${text}.charAt(${at})`;
    } else if (where === 'FROM_END') {
        const at = window.Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT', 1, true);
        code = `${text}.slice(${at}).charAt(0)`;
    } else if (where === 'FIRST') {
        code = `${text}.charAt(0)`;
    } else if (where === 'LAST') {
        code = `${text}.slice(-1)`;
    } else if (where === 'RANDOM') {
        // eslint-disable-next-line no-underscore-dangle
        const functionName = window.Blockly.JavaScript.javascriptGenerator.provideFunction_('textRandomLetter', [
            // eslint-disable-next-line no-underscore-dangle
            `function ${window.Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(text) {
                var x = Math.floor(Math.random() * text.length);
                return text[x];
            }`,
        ]);
        code = `${functionName}(${text})`;
    }
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
