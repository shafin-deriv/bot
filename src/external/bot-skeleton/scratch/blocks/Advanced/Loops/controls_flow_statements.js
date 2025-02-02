import { localize } from '@deriv-com/translations';

window.Blockly.Blocks.controls_flow_statements = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('{{ break_or_continue }} of loop', { break_or_continue: '%1' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'FLOW',
                    options: [
                        [localize('break out'), 'BREAK'],
                        [localize('continue with next iteration'), 'CONTINUE'],
                    ],
                },
            ],
            inputsInline: true,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize(
                'This block is used to either terminate or continue a loop, and can be placed anywhere within a loop block.'
            ),
            category: window.Blockly.Categories.Loop,
        };
    },
    meta() {
        return {
            display_name: localize('Break out/continue'),
            description: localize(
                'This block is used to either terminate or continue a loop, and can be placed anywhere within a loop block.'
            ),
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.controls_flow_statements = block => {
    const keyword = block.getFieldValue('FLOW') === 'BREAK' ? 'break' : 'continue';
    return `${keyword};\n`;
};
