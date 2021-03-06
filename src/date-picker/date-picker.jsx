let React = require('react');
let StylePropable = require('../mixins/style-propable');
let WindowListenable = require('../mixins/window-listenable');
let DateTime = require('../utils/date-time');
let DatePickerDialog = require('./date-picker-dialog');
let TextField = require('../text-field');

let DatePicker = React.createClass({

  mixins: [StylePropable, WindowListenable],

  propTypes: {
    defaultDate: React.PropTypes.object,
    formatDate: React.PropTypes.func,
    mode: React.PropTypes.oneOf(['portrait', 'landscape', 'inline']),
    onFocus: React.PropTypes.func,
    onTouchTap: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onShow: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    minDate: React.PropTypes.object,
    maxDate: React.PropTypes.object,
    shouldDisableDate: React.PropTypes.func,
    hideToolbarYearChange: React.PropTypes.bool,
    autoOk: React.PropTypes.bool,
    showYearSelector: React.PropTypes.bool
  },

  windowListeners: {
    'keyup': '_handleWindowKeyUp'
  },

  getDefaultProps: function() {
    return {
      formatDate: DateTime.format,
      autoOk: false,
      showYearSelector: false
    };
  },

  getInitialState: function() {
    return {
      date: this.props.defaultDate,
      dialogDate: new Date()
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.defaultDate !== nextProps.defaultDate) {
      this.setDate(nextProps.defaultDate);
    }
  },

  render: function() {
    let {
      formatDate,
      mode,
      onFocus,
      onTouchTap,
      onShow,
      onDismiss,
      minDate,
      maxDate,
      autoOk,
      showYearSelector,
      ...other
    } = this.props;
    let defaultInputValue;

    if (this.props.defaultDate) {
      defaultInputValue = this.props.formatDate(this.props.defaultDate);
    }

    return (
      <div style={this.props.style}>
        <TextField
          {...other}
          ref="input"
          defaultValue={defaultInputValue}
          onFocus={this._handleInputFocus}
          onTouchTap={this._handleInputTouchTap}/>
        <DatePickerDialog
          ref="dialogWindow"
          mode={this.props.mode}
          initialDate={this.state.dialogDate}
          onAccept={this._handleDialogAccept}
          onShow={onShow}
          onDismiss={this._handleDialogDismiss}
          minDate={minDate}
          maxDate={maxDate}
          autoOk={autoOk}
          showYearSelector={showYearSelector}
          shouldDisableDate={this.props.shouldDisableDate}
          hideToolbarYearChange={this.props.hideToolbarYearChange} />
      </div>

    );
  },

  getDate: function() {
    return this.state.date;
  },

  setDate: function(d) {
    this.setState({
      date: d
    });
    this.refs.input.setValue(this.props.formatDate(d));
  },

  _handleDialogAccept: function(d) {
    this.setDate(d);
    if (this.props.onChange) this.props.onChange(null, d);
  },

  _handleDialogDismiss: function() {
    if (this.props.onDismiss) this.props.onDismiss();
  },

  _handleInputFocus: function(e) {
    e.target.blur();
    if (this.props.onFocus) this.props.onFocus(e);
  },

  _handleInputTouchTap: function(e) {
    this.setState({
      dialogDate: this.getDate()
    });

    this.refs.dialogWindow.show();
    if (this.props.onTouchTap) this.props.onTouchTap(e);
  },

  _handleWindowKeyUp: function() {
    //TO DO: open the dialog if input has focus
  }

});

module.exports = DatePicker;
