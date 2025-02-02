import { localize } from '@deriv-com/translations';
import { runGroupedEvents, runIrreversibleEvents } from '../../../utils';
import { minusIconDark } from '../../images';

window.Blockly.Blocks.lists_statement = {
    required_parent_type: 'lists_create_with',
    init() {
        this.required_parent_id = '';
        const field_image = new window.Blockly.FieldImage(minusIconDark, 25, 25, '', () => this.onIconClick());
        this.jsonInit(this.definition());
        this.appendDummyInput('REMOVE_ICON').appendField(field_image);
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            inputsInline: true,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            category: window.Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('List Statement'),
            description: '',
        };
    },
    onIconClick() {
        if (this.workspace.options.readOnly || window.Blockly.derivWorkspace.isFlyout_) {
            return;
        }

        runGroupedEvents(false, () => {
            this.unplug(true);
            this.dispose();
        });
    },
    onchange(event) {
        if (!this.workspace || window.Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }

        if (event.type === window.Blockly.Events.BLOCK_DRAG && !event.isStart) {
            const surround_parent = this.getSurroundParent();

            if (!surround_parent) {
                runIrreversibleEvents(() => {
                    this.dispose();
                });
            } else if (!this.required_parent_id && surround_parent.type === this.required_parent_type) {
                // Create connection between parent and orphaned child.
                this.required_parent_id = surround_parent.id;
            } else if (surround_parent.id !== this.required_parent_id) {
                // Someone pretending to be this child's parent. Find original parent and reconnect.
                // Happens when someone tries to connect a statement block and Blockly automagically
                // reconnects the children to this foreign statement block.
                const all_blocks = this.workspace.getAllBlocks();
                const original_parent = all_blocks.find(block => block.id === this.required_parent_id);

                if (original_parent) {
                    const last_connection = original_parent.getLastConnectionInStatement('STACK');

                    runIrreversibleEvents(() => {
                        last_connection.connect(this.previousConnection);
                    });
                } else {
                    // Dispose child if it became a child of an illegal parent and original parent
                    // is nowhere to be found.
                    runIrreversibleEvents(() => {
                        this.dispose(/* healStack */ true);
                    });
                }
            }
        }
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.lists_statement = block => {
    const code =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'VALUE',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || 'null';
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
