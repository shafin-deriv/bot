import { getCurrencyDisplayCode } from '@/components/shared';
import { localize } from '@deriv-com/translations';
import { config } from '../../../../constants/config';

window.Blockly.Blocks.multiplier_stop_loss = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Stop Loss: {{ currency }} {{ stop_loss }}', {
                currency: '%1',
                stop_loss: '%2',
            }),
            args0: [
                {
                    type: 'field_label',
                    name: 'CURRENCY_LIST',
                    text: getCurrencyDisplayCode(config.lists.CURRENCY[0]),
                },
                {
                    type: 'input_value',
                    name: 'AMOUNT',
                    check: 'Number',
                },
            ],
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize(
                'Your contract is closed automatically when your loss is more than or equals to this amount. This block can only be used with the multipliers trade type.'
            ),
            category: window.Blockly.Categories.Trade_Definition,
        };
    },
    meta() {
        return {
            display_name: localize('Stop loss'),
            description: localize(
                'Your contract is closed automatically when your loss is more than or equals to this amount. This block can only be used with the multipliers trade type.'
            ),
        };
    },
    onchange(event) {
        if (!this.workspace || window.Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }
        if (
            (event.type === window.Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) ||
            (event.type === window.Blockly.Events.BLOCK_DRAG && !event.isStart)
        ) {
            this.setCurrency();
        }
    },
    restricted_parents: ['trade_definition_multiplier'],
    setCurrency: window.Blockly.Blocks.trade_definition_tradeoptions.setCurrency,
    getRequiredValueInputs() {
        const field_input = this.getInput('AMOUNT');
        if (field_input.connection.targetBlock()) {
            return {
                AMOUNT: input => {
                    const input_number = Number(input);
                    this.error_message = localize('Stop loss must be a positive number.');
                    return !isNaN(input_number) && input_number <= 0;
                },
            };
        }
        return {};
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.multiplier_stop_loss = () => {};
