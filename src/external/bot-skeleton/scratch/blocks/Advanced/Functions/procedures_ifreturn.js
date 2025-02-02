import { localize } from '@deriv-com/translations';

/**
 * Block for conditionally returning a value from a procedure.
 * @this window.Blockly.Block
 */
window.Blockly.Blocks.procedures_ifreturn = {
    init() {
        this.hasReturnValue = true;
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('if {{ condition }} return {{ value }}', { condition: '%1', value: '%2' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'CONDITION',
                },
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            inputsInline: true,
            colour: window.Blockly.Colours.Special2.colour,
            colourSecondary: window.Blockly.Colours.Special2.colourSecondary,
            colourTertiary: window.Blockly.Colours.Special2.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Prematurely returns a value within a function'),
            category: window.Blockly.Categories.Functions,
        };
    },
    meta() {
        return {
            display_name: localize('Conditional return'),
            description: localize(
                'This block returns a value when a condition is true. Use this block within either of the function blocks above.'
            ),
        };
    },
    /**
     * Create XML to represent whether this block has a return value.
     * @return {!Element} XML storage element.
     * @this window.Blockly.Block
     */
    mutationToDom() {
        const container = document.createElement('mutation');
        container.setAttribute('value', Number(this.hasReturnValue));
        return container;
    },
    /**
     * Parse XML to restore whether this block has a return value.
     * @param {!Element} xmlElement XML storage element.
     * @this window.Blockly.Block
     */
    domToMutation(xmlElement) {
        const value = xmlElement.getAttribute('value');
        this.hasReturnValue = value === '1';

        if (!this.hasReturnValue) {
            this.removeInput('VALUE');
            this.appendDummyInput('VALUE').appendField(localize('return'));
            this.initSvg();
            this.renderEfficiently();
        }
    },
    /**
     * Called whenever anything on the workspace changes.
     * Add warning if this flow block is not nested inside a loop.
     * @param {!window.Blockly.Events.Abstract} e Change event.
     * @this window.Blockly.Block
     */
    onchange(/* e */) {
        if (!this.workspace.isDragging || this.workspace.isDragging()) {
            return; // Don't change state at the start of a drag.
        }

        let legal = false;

        // Is the block nested in a procedure?
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let block = this;
        do {
            if (this.FUNCTION_TYPES.indexOf(block.type) !== -1) {
                legal = true;
                break;
            }
            block = block.getSurroundParent();
        } while (block);

        if (legal) {
            const rerender = () => {
                this.initSvg();
                this.renderEfficiently();
            };

            // If needed, toggle whether this block has a return value.
            if (block.type === 'procedures_defnoreturn' && this.hasReturnValue) {
                this.removeInput('VALUE');
                this.appendDummyInput('VALUE').appendField(localize('return'));
                rerender();
                this.hasReturnValue = false;
            } else if (block.type === 'procedures_defreturn' && !this.hasReturnValue) {
                this.removeInput('VALUE');
                this.appendValueInput('VALUE').appendField(localize('return'));
                rerender();
                this.hasReturnValue = true;
            }

            if (!window.Blockly.derivWorkspace.isFlyout_) {
                this.setDisabled(false);
            }
        } else if (!window.Blockly.derivWorkspace.isFlyout_ && !this.getInheritedDisabled()) {
            this.setDisabled(true);
        }
    },
    /**
     * List of block types that are functions and thus do not need warnings.
     * To add a new function type add this to your code:
     * window.Blockly.Blocks['procedures_ifreturn'].FUNCTION_TYPES.push('custom_func');
     */
    FUNCTION_TYPES: ['procedures_defnoreturn', 'procedures_defreturn'],
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.procedures_ifreturn = block => {
    const condition =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'CONDITION',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_NONE
        ) || 'false';

    let branch;
    if (block.hasReturnValue) {
        const value =
            window.Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'VALUE',
                window.Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || 'null';
        branch = `return ${value};\n`;
    } else {
        branch = 'return;\n';
    }

    const code = `
    if (${condition}) {
        ${branch}
    }\n`;
    return code;
};
