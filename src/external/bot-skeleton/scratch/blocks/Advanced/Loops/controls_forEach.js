import { localize } from '@deriv-com/translations';

window.Blockly.Blocks.controls_forEach = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('for each item {{ variable }} in list {{ input_list }}', {
                variable: '%1',
                input_list: '%2',
            }),
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: null,
                },
                {
                    type: 'input_value',
                    name: 'LIST',
                    check: 'Array',
                },
            ],
            message1: localize('do %1'),
            args1: [
                {
                    type: 'input_statement',
                    name: 'DO',
                },
            ],
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Iterates through a given list'),
            category: window.Blockly.Categories.Loop,
        };
    },
    meta() {
        return {
            display_name: localize('Iterate (2)'),
            description: localize(
                'This block uses the variable "i" to control the iterations. With each iteration, the value of "i" is determined by the items in a given list.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            LIST: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.controls_forEach = block => {
    // eslint-disable-next-line no-underscore-dangle
    const variable0 = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'),
        window.Blockly.Variables.CATEGORY_NAME
    );
    const argument0 =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'LIST',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ASSIGNMENT
        ) || '[]';

    let branch = window.Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'DO');
    branch = window.Blockly.JavaScript.javascriptGenerator.addLoopTrap(branch, block.id);

    let code = '';

    // Cache non-trivial values to variables to prevent repeated look-ups.
    let listVar = argument0;
    if (!argument0.match(/^\w+$/)) {
        // eslint-disable-next-line no-underscore-dangle
        listVar = window.Blockly.JavaScript.variableDB_.getDistinctName(
            `${variable0}_list`,
            window.Blockly.Variables.CATEGORY_NAME
        );
        code = `var ${listVar} = ${argument0};\n`;
    }

    // eslint-disable-next-line no-underscore-dangle
    const indexVar = window.Blockly.JavaScript.variableDB_.getDistinctName(
        `${variable0}_list`,
        window.Blockly.Variables.CATEGORY_NAME
    );

    code += `
    for (var ${indexVar} in ${listVar}) {
        ${variable0} = ${listVar}[${indexVar}];
        ${branch}
    }\n`;

    return code;
};
