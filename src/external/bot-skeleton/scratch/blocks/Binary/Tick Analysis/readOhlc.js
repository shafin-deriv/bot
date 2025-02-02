import { localize } from '@deriv-com/translations';
import { config } from '../../../../constants/config';

window.Blockly.Blocks.read_ohlc = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('In candles list read {{ candle_property }} # from end {{ input_number }}', {
                candle_property: '%1',
                input_number: '%2',
            }),
            message1: localize('with interval: %1'),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OHLCFIELD_LIST',
                    options: config.ohlcFields,
                },
                {
                    type: 'input_value',
                    name: 'CANDLEINDEX',
                    check: 'Number',
                },
            ],
            args1: [
                {
                    type: 'field_dropdown',
                    name: 'CANDLEINTERVAL_LIST',
                    options: config.candleIntervals,
                },
            ],
            output: 'Number',
            outputShape: window.Blockly.OUTPUT_SHAPE_ROUND,
            colour: window.Blockly.Colours.Base.colour,
            colourSecondary: window.Blockly.Colours.Base.colourSecondary,
            colourTertiary: window.Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Read the selected candle value'),
            category: window.Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Read candle value (1)'),
            description: localize('This block gives you the specified candle value for a selected time interval.'),
        };
    },
    getRequiredValueInputs() {
        return {
            CANDLEINDEX: null,
        };
    },
};

window.Blockly.JavaScript.javascriptGenerator.forBlock.read_ohlc = block => {
    const selectedGranularity = block.getFieldValue('CANDLEINTERVAL_LIST');
    const granularity = selectedGranularity === 'default' ? 'undefined' : selectedGranularity;
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST');
    const index =
        window.Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'CANDLEINDEX',
            window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '1';

    const code = `Bot.getOhlcFromEnd({ field: '${ohlcField}', index: ${index}, granularity: ${granularity} })`;
    return [code, window.Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
