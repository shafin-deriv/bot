import { localize } from '@deriv-com/translations';
import { runGroupedEvents } from '../../utils';
import { plusIconDark } from '../images';

window.Blockly.Blocks.text_join = {
    protected_statements: ['STACK'],
    allowed_children: ['text_statement'],
    init() {
        const field_image = new window.Blockly.FieldImage(plusIconDark, 25, 25, '', this.onIconClick.bind(this));
        this.jsonInit(this.definition());
        this.appendDummyInput('ADD_ICON').appendField(field_image);
        this.moveInputBefore('ADD_ICON', 'STACK');
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to create text with', { variable: '%1' }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: localize('text'),
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'STACK',
                },
            ],
            inputsInline: true,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Text join'),
            category: window.Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Text join'),
            description: localize(
                'Creates a single text string from combining the text value of each attached item, without spaces in between. The number of items can be added accordingly.'
            ),
        };
    },
    onIconClick() {
        if (this.workspace.options.readOnly || window.Blockly.derivWorkspace.isFlyout_) {
            return;
        }

        runGroupedEvents(false, () => {
            const text_block = this.workspace.newBlock('text_statement');
            text_block.required_parent_id = this.id;
            text_block.setMovable(true);
            text_block.initSvg();
            // kept this commented to fix backward compatibility issue
            text_block?.renderEfficiently();

            const shadow_block = this.workspace.newBlock('text');
            shadow_block.setShadow(true);
            shadow_block.setFieldValue('', 'TEXT');
            shadow_block.initSvg();
            // kept this commented to fix backward compatibility issue
            shadow_block?.renderEfficiently();

            const text_input = text_block.getInput('TEXT');
            text_input.connection.connect(shadow_block.outputConnection);

            const connection = this.getLastConnectionInStatement('STACK');
            connection.connect(text_block.previousConnection);
        });

        // TODO: Open editor and focus so user can add string right away?
        // const inputField = shadow_block.getField('TEXT');
        // inputField.showEditor_();
    },
    onchange: window.Blockly.Blocks.lists_create_with.onchange,
};

// window.Blockly.JavaScript.text_join = window.Blockly.JavaScript.lists_create_with;
window.Blockly.JavaScript.javascriptGenerator.forBlock.text_join = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = window.Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        window.Blockly.Variables.CATEGORY_NAME
    );
    const blocks_in_stack = block.getBlocksInStatement('STACK');
    const elements = blocks_in_stack.map(b => {
        const value = window.Blockly.JavaScript.javascriptGenerator.forBlock[b.type](b);
        return Array.isArray(value) ? value[0] : value;
    });

    const code = `${var_name} = [${elements}].join(" ");\n`;
    return code;
};
