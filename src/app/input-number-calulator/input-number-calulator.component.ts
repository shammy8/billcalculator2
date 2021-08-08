// import {
//   Component,
//   ChangeDetectionStrategy,
//   Input,
//   ElementRef,
//   ViewChild,
//   OnInit,
//   EventEmitter,
//   Output,
//   forwardRef,
//   ViewEncapsulation,
//   ChangeDetectorRef,
// } from '@angular/core';
// import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// export const INPUTNUMBER_VALUE_ACCESSOR: any = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => InputNumberCalculatorComponent),
//   multi: true,
// };

// @Component({
//   selector: 'bc-input-number-calculator',
//   template: `
//     <span
//       [ngClass]="{
//         'p-inputnumber p-component': true
//       }"
//       [ngStyle]="style"
//       [class]="styleClass"
//     >
//       <input
//         #input
//         [ngClass]="'p-inputnumber-input'"
//         [ngStyle]="inputStyle"
//         [class]="inputStyleClass"
//         pInputText
//         [value]="formattedValue()"
//         [attr.placeholder]="placeholder"
//         [attr.title]="title"
//         [attr.id]="inputId"
//         [attr.size]="size"
//         [attr.name]="name"
//         [attr.autocomplete]="autocomplete"
//         [attr.maxlength]="maxlength"
//         [attr.tabindex]="tabindex"
//         [attr.aria-label]="ariaLabel"
//         [attr.aria-required]="ariaRequired"
//         [disabled]="disabled"
//         [attr.required]="required"
//         [attr.aria-valuemin]="min"
//         [attr.aria-valuemax]="max"
//         (input)="onUserInput($event)"
//         (keydown)="onInputKeyDown($event)"
//         (keypress)="onInputKeyPress($event)"
//         (paste)="onPaste($event)"
//         (click)="onInputClick()"
//         (focus)="onInputFocus($event)"
//         (blur)="onInputBlur($event)"
//       />
//     </span>
//   `,
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   providers: [INPUTNUMBER_VALUE_ACCESSOR],
//   encapsulation: ViewEncapsulation.None,
//   // styleUrls: ['./inputnumber.css'],
//   host: {
//     '[class.p-inputwrapper-filled]': 'filled',
//     '[class.p-inputwrapper-focus]': 'focused',
//   },
// })
// export class InputNumberCalculatorComponent
//   implements OnInit, ControlValueAccessor
// {
//   @Input() format: boolean = true;

//   @Input() inputId: string | undefined;

//   @Input() styleClass!: string;

//   @Input() style: any;

//   @Input() placeholder: string | undefined;

//   @Input() size: number | undefined;

//   @Input() maxlength: number | undefined;

//   @Input() tabindex: string | undefined;

//   @Input() title: string | undefined;

//   @Input() ariaLabel: string | undefined;

//   @Input() ariaRequired: boolean | undefined;

//   @Input() name: string | undefined;

//   @Input() required: boolean | undefined;

//   @Input() autocomplete: string | undefined;

//   @Input() min: number | undefined;

//   @Input() max: number | undefined;

//   @Input() step: number = 1;

//   @Input() inputStyle: any;

//   @Input() inputStyleClass!: string;

//   @ViewChild('input') input!: ElementRef;

//   @Output() onInput: EventEmitter<any> = new EventEmitter();

//   @Output() onFocus: EventEmitter<any> = new EventEmitter();

//   @Output() onBlur: EventEmitter<any> = new EventEmitter();

//   @Output() onKeyDown: EventEmitter<any> = new EventEmitter();

//   value: number | undefined;

//   onModelChange: Function = () => {};

//   onModelTouched: Function = () => {};

//   focused: boolean | undefined;

//   initialized: boolean | undefined;

//   groupChar: string = '';

//   prefixChar: string = '';

//   suffixChar: string = '';

//   isSpecialChar: boolean | undefined;

//   timer: any;

//   lastValue: string | undefined;

//   _numeral: any;

//   numberFormat: any;

//   _decimal: any;

//   _group: any;

//   _minusSign: any;

//   _currency: any;

//   _prefix: any;

//   _suffix: any;

//   _index: any;

//   _localeOption: string | undefined;

//   _localeMatcherOption: string | undefined;

//   _modeOption: string = 'decimal';

//   _currencyOption: string | undefined;

//   _currencyDisplayOption: string | undefined;

//   _useGroupingOption: boolean = true;

//   _minFractionDigitsOption: number | undefined;

//   _maxFractionDigitsOption: number | undefined;

//   _prefixOption: string | undefined;

//   _suffixOption: string | undefined;

//   _disabled: boolean | undefined;

//   @Input() get locale(): string | undefined {
//     return this._localeOption;
//   }

//   set locale(localeOption: string | undefined) {
//     this._localeOption = localeOption;
//     this.updateConstructParser();
//   }

//   @Input() get localeMatcher(): string | undefined {
//     return this._localeMatcherOption;
//   }

//   set localeMatcher(localeMatcherOption: string | undefined) {
//     this._localeMatcherOption = localeMatcherOption;
//     this.updateConstructParser();
//   }

//   @Input() get mode(): string {
//     return this._modeOption;
//   }

//   set mode(modeOption: string) {
//     this._modeOption = modeOption;
//     this.updateConstructParser();
//   }

//   @Input() get currency(): string | undefined {
//     return this._currencyOption;
//   }

//   set currency(currencyOption: string | undefined) {
//     this._currencyOption = currencyOption;
//     this.updateConstructParser();
//   }

//   @Input() get currencyDisplay(): string | undefined {
//     return this._currencyDisplayOption;
//   }

//   set currencyDisplay(currencyDisplayOption: string | undefined) {
//     this._currencyDisplayOption = currencyDisplayOption;
//     this.updateConstructParser();
//   }

//   @Input() get useGrouping(): boolean {
//     return this._useGroupingOption;
//   }

//   set useGrouping(useGroupingOption: boolean) {
//     this._useGroupingOption = useGroupingOption;
//     this.updateConstructParser();
//   }

//   @Input() get minFractionDigits(): number | undefined {
//     return this._minFractionDigitsOption;
//   }

//   set minFractionDigits(minFractionDigitsOption: number | undefined) {
//     this._minFractionDigitsOption = minFractionDigitsOption;
//     this.updateConstructParser();
//   }

//   @Input() get maxFractionDigits(): number | undefined {
//     return this._maxFractionDigitsOption;
//   }

//   set maxFractionDigits(maxFractionDigitsOption: number | undefined) {
//     this._maxFractionDigitsOption = maxFractionDigitsOption;
//     this.updateConstructParser();
//   }

//   @Input() get prefix(): string | undefined {
//     return this._prefixOption;
//   }

//   set prefix(prefixOption: string | undefined) {
//     this._prefixOption = prefixOption;
//     this.updateConstructParser();
//   }

//   @Input() get suffix(): string | undefined {
//     return this._suffixOption;
//   }

//   set suffix(suffixOption: string | undefined) {
//     this._suffixOption = suffixOption;
//     this.updateConstructParser();
//   }

//   @Input() get disabled(): boolean | undefined {
//     return this._disabled;
//   }

//   set disabled(disabled: boolean | undefined) {
//     if (disabled) this.focused = false;

//     this._disabled = disabled;

//     if (this.timer) this.clearTimer();
//   }

//   constructor(public el: ElementRef, private cd: ChangeDetectorRef) {}

//   ngOnInit() {
//     this.constructParser();
//     this.initialized = true;
//   }

//   getOptions() {
//     return {
//       localeMatcher: this.localeMatcher,
//       style: this.mode,
//       currency: this.currency,
//       currencyDisplay: this.currencyDisplay,
//       useGrouping: this.useGrouping,
//       minimumFractionDigits: this.minFractionDigits,
//       maximumFractionDigits: this.maxFractionDigits,
//     };
//   }

//   constructParser() {
//     this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
//     const numerals = [
//       ...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(
//         9876543210
//       ),
//     ].reverse();
//     const index = new Map(numerals.map((d, i) => [d, i]));
//     this._numeral = new RegExp(`[${numerals.join('')}]`, 'g');
//     this._decimal = this.getDecimalExpression();
//     this._group = this.getGroupingExpression();
//     this._minusSign = this.getMinusSignExpression();
//     this._currency = this.getCurrencyExpression();
//     this._suffix = this.getSuffixExpression();
//     this._prefix = this.getPrefixExpression();
//     this._index = (d: any) => index.get(d);
//   }

//   updateConstructParser() {
//     if (this.initialized) {
//       this.constructParser();
//     }
//   }

//   escapeRegExp(text: any) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
//   }

//   getDecimalExpression() {
//     const formatter = new Intl.NumberFormat(this.locale, {
//       useGrouping: false,
//     });
//     return new RegExp(
//       `[${formatter.format(1.1).trim().replace(this._numeral, '')}]`,
//       'g'
//     );
//   }

//   getGroupingExpression() {
//     const formatter = new Intl.NumberFormat(this.locale, { useGrouping: true });
//     this.groupChar = formatter
//       .format(1000000)
//       .trim()
//       .replace(this._numeral, '')
//       .charAt(0);
//     return new RegExp(`[${this.groupChar}]`, 'g');
//   }

//   getMinusSignExpression() {
//     const formatter = new Intl.NumberFormat(this.locale, {
//       useGrouping: false,
//     });
//     return new RegExp(
//       `[${formatter.format(-1).trim().replace(this._numeral, '')}]`,
//       'g'
//     );
//   }

//   getCurrencyExpression() {
//     if (this.currency) {
//       const formatter = new Intl.NumberFormat(this.locale, {
//         style: 'currency',
//         currency: this.currency,
//         currencyDisplay: this.currencyDisplay,
//       });
//       return new RegExp(
//         `[${formatter
//           .format(1)
//           .replace(/\s/g, '')
//           .replace(this._numeral, '')
//           .replace(this._decimal, '')
//           .replace(this._group, '')}]`,
//         'g'
//       );
//     }

//     return new RegExp(`[]`, 'g');
//   }

//   getPrefixExpression() {
//     if (this.prefix) {
//       this.prefixChar = this.prefix;
//     } else {
//       const formatter = new Intl.NumberFormat(this.locale, {
//         style: this.mode,
//         currency: this.currency,
//         currencyDisplay: this.currencyDisplay,
//       });
//       this.prefixChar = formatter.format(1).split('1')[0];
//     }

//     return new RegExp(`${this.escapeRegExp(this.prefixChar || '')}`, 'g');
//   }

//   getSuffixExpression() {
//     if (this.suffix) {
//       this.suffixChar = this.suffix;
//     } else {
//       const formatter = new Intl.NumberFormat(this.locale, {
//         style: this.mode,
//         currency: this.currency,
//         currencyDisplay: this.currencyDisplay,
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       });
//       this.suffixChar = formatter.format(1).split('1')[1];
//     }

//     return new RegExp(`${this.escapeRegExp(this.suffixChar || '')}`, 'g');
//   }

//   formatValue(value: any) {
//     if (value != null) {
//       if (value === '-') {
//         // Minus sign
//         return value;
//       }

//       if (this.format) {
//         let formatter = new Intl.NumberFormat(this.locale, this.getOptions());
//         let formattedValue = formatter.format(value);
//         if (this.prefix) {
//           formattedValue = this.prefix + formattedValue;
//         }

//         if (this.suffix) {
//           formattedValue = formattedValue + this.suffix;
//         }

//         return formattedValue;
//       }

//       return value.toString();
//     }

//     return '';
//   }

//   parseValue(text: any) {
//     let filteredText = text
//       .replace(this._suffix, '')
//       .replace(this._prefix, '')
//       .trim()
//       .replace(/\s/g, '')
//       .replace(this._currency, '')
//       .replace(this._group, '')
//       .replace(this._minusSign, '-')
//       .replace(this._decimal, '.')
//       .replace(this._numeral, this._index);

//     if (filteredText) {
//       if (filteredText === '-')
//         // Minus sign
//         return filteredText;

//       let parsedValue = +filteredText;
//       return isNaN(parsedValue) ? null : parsedValue;
//     }

//     return null;
//   }

//   repeat(event: any, interval: any, dir: any) {
//     let i = interval || 500;

//     this.clearTimer();
//     this.timer = setTimeout(() => {
//       this.repeat(event, 40, dir);
//     }, i);

//     this.spin(event, dir);
//   }

//   spin(event: any, dir: any) {
//     let step = this.step * dir;
//     let currentValue = this.parseValue(this.input.nativeElement.value) || 0;
//     let newValue = this.validateValue(currentValue + step);
//     if (this.maxlength && this.maxlength < this.formatValue(newValue).length) {
//       return;
//     }

//     this.updateInput(newValue, null, 'spin');
//     this.updateModel(event, newValue);

//     this.handleOnInput(event, currentValue, newValue);
//   }

//   onUpButtonMouseDown(event: any) {
//     this.input.nativeElement.focus();
//     this.repeat(event, null, 1);
//     event.preventDefault();
//   }

//   onUpButtonMouseUp() {
//     this.clearTimer();
//   }

//   onUpButtonMouseLeave() {
//     this.clearTimer();
//   }

//   onUpButtonKeyDown(event: any) {
//     if (event.keyCode === 32 || event.keyCode === 13) {
//       this.repeat(event, null, 1);
//     }
//   }

//   onUpButtonKeyUp() {
//     this.clearTimer();
//   }

//   onDownButtonMouseDown(event: any) {
//     this.input.nativeElement.focus();
//     this.repeat(event, null, -1);
//     event.preventDefault();
//   }

//   onDownButtonMouseUp() {
//     this.clearTimer();
//   }

//   onDownButtonMouseLeave() {
//     this.clearTimer();
//   }

//   onDownButtonKeyUp() {
//     this.clearTimer();
//   }

//   onDownButtonKeyDown(event: any) {
//     if (event.keyCode === 32 || event.keyCode === 13) {
//       this.repeat(event, null, -1);
//     }
//   }

//   onUserInput(event: any) {
//     if (this.isSpecialChar) {
//       event.target.value = this.lastValue;
//     }
//     this.isSpecialChar = false;
//   }

//   onInputKeyDown(event: any) {
//     this.lastValue = event.target.value;
//     if (event.shiftKey || event.altKey) {
//       this.isSpecialChar = true;
//       return;
//     }

//     let selectionStart = event.target.selectionStart;
//     let selectionEnd = event.target.selectionEnd;
//     let inputValue = event.target.value;
//     let newValueStr = null;

//     if (event.altKey) {
//       event.preventDefault();
//     }

//     switch (event.which) {
//       //up
//       case 38:
//         this.spin(event, 1);
//         event.preventDefault();
//         break;

//       //down
//       case 40:
//         this.spin(event, -1);
//         event.preventDefault();
//         break;

//       //left
//       case 37:
//         if (!this.isNumeralChar(inputValue.charAt(selectionStart - 1))) {
//           event.preventDefault();
//         }
//         break;

//       //right
//       case 39:
//         if (!this.isNumeralChar(inputValue.charAt(selectionStart))) {
//           event.preventDefault();
//         }
//         break;

//       //enter
//       case 13:
//         let newValue = this.validateValue(
//           this.parseValue(this.input.nativeElement.value)
//         );
//         this.input.nativeElement.value = this.formatValue(newValue);
//         this.input.nativeElement.setAttribute('aria-valuenow', newValue);
//         this.updateModel(event, newValue);
//         break;

//       //backspace
//       case 8: {
//         event.preventDefault();

//         if (selectionStart === selectionEnd) {
//           let deleteChar = inputValue.charAt(selectionStart - 1);
//           let decimalCharIndex = inputValue.search(this._decimal);
//           this._decimal.lastIndex = 0;

//           if (this.isNumeralChar(deleteChar)) {
//             if (this._group.test(deleteChar)) {
//               this._group.lastIndex = 0;
//               newValueStr =
//                 inputValue.slice(0, selectionStart - 2) +
//                 inputValue.slice(selectionStart - 1);
//             } else if (this._decimal.test(deleteChar)) {
//               this._decimal.lastIndex = 0;
//               this.input.nativeElement.setSelectionRange(
//                 selectionStart - 1,
//                 selectionStart - 1
//               );
//             } else if (
//               decimalCharIndex > 0 &&
//               selectionStart > decimalCharIndex
//             ) {
//               newValueStr =
//                 inputValue.slice(0, selectionStart - 1) +
//                 '0' +
//                 inputValue.slice(selectionStart);
//             } else if (decimalCharIndex > 0 && decimalCharIndex === 1) {
//               newValueStr =
//                 inputValue.slice(0, selectionStart - 1) +
//                 '0' +
//                 inputValue.slice(selectionStart);
//               newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : '';
//             } else {
//               newValueStr =
//                 inputValue.slice(0, selectionStart - 1) +
//                 inputValue.slice(selectionStart);
//             }
//           }

//           this.updateValue(event, newValueStr, null, 'delete-single');
//         } else {
//           newValueStr = this.deleteRange(
//             inputValue,
//             selectionStart,
//             selectionEnd
//           );
//           this.updateValue(event, newValueStr, null, 'delete-range');
//         }

//         break;
//       }

//       // del
//       case 46:
//         event.preventDefault();

//         if (selectionStart === selectionEnd) {
//           let deleteChar = inputValue.charAt(selectionStart);
//           let decimalCharIndex = inputValue.search(this._decimal);
//           this._decimal.lastIndex = 0;

//           if (this.isNumeralChar(deleteChar)) {
//             if (this._group.test(deleteChar)) {
//               this._group.lastIndex = 0;
//               newValueStr =
//                 inputValue.slice(0, selectionStart) +
//                 inputValue.slice(selectionStart + 2);
//             } else if (this._decimal.test(deleteChar)) {
//               this._decimal.lastIndex = 0;
//               this.input.nativeElement.setSelectionRange(
//                 selectionStart + 1,
//                 selectionStart + 1
//               );
//             } else if (
//               decimalCharIndex > 0 &&
//               selectionStart > decimalCharIndex
//             ) {
//               newValueStr =
//                 inputValue.slice(0, selectionStart) +
//                 '0' +
//                 inputValue.slice(selectionStart + 1);
//             } else if (decimalCharIndex > 0 && decimalCharIndex === 1) {
//               newValueStr =
//                 inputValue.slice(0, selectionStart) +
//                 '0' +
//                 inputValue.slice(selectionStart + 1);
//               newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : '';
//             } else {
//               newValueStr =
//                 inputValue.slice(0, selectionStart) +
//                 inputValue.slice(selectionStart + 1);
//             }
//           }

//           this.updateValue(event, newValueStr, null, 'delete-back-single');
//         } else {
//           newValueStr = this.deleteRange(
//             inputValue,
//             selectionStart,
//             selectionEnd
//           );
//           this.updateValue(event, newValueStr, null, 'delete-range');
//         }
//         break;

//       default:
//         break;
//     }

//     this.onKeyDown.emit(event);
//   }

//   onInputKeyPress(event: any) {
//     event.preventDefault();
//     let code = event.which || event.keyCode;
//     let char = String.fromCharCode(code);
//     const isDecimalSign = this.isDecimalSign(char);
//     const isMinusSign = this.isMinusSign(char);

//     if ((48 <= code && code <= 57) || isMinusSign || isDecimalSign) {
//       this.insert(event, char, { isDecimalSign, isMinusSign });
//     }
//   }

//   onPaste(event: any) {
//     if (!this.disabled) {
//       event.preventDefault();
//       let data = (
//         event.clipboardData || window['clipboardData' as any]
//       ).getData('Text');
//       if (data) {
//         let filteredData = this.parseValue(data);
//         if (filteredData != null) {
//           this.insert(event, filteredData.toString());
//         }
//       }
//     }
//   }

//   isMinusSign(char: any) {
//     if (this._minusSign.test(char)) {
//       this._minusSign.lastIndex = 0;
//       return true;
//     }

//     return false;
//   }

//   isDecimalSign(char: any) {
//     if (this._decimal.test(char)) {
//       this._decimal.lastIndex = 0;
//       return true;
//     }

//     return false;
//   }

//   insert(
//     event: any,
//     text: any,
//     sign = { isDecimalSign: false, isMinusSign: false }
//   ) {
//     let selectionStart = this.input.nativeElement.selectionStart;
//     let selectionEnd = this.input.nativeElement.selectionEnd;
//     let inputValue = this.input.nativeElement.value.trim();
//     const decimalCharIndex = inputValue.search(this._decimal);
//     this._decimal.lastIndex = 0;
//     const minusCharIndex = inputValue.search(this._minusSign);
//     this._minusSign.lastIndex = 0;
//     let newValueStr;

//     if (sign.isMinusSign) {
//       if (selectionStart === 0) {
//         newValueStr = inputValue;
//         if (minusCharIndex === -1 || selectionEnd !== 0) {
//           newValueStr = this.insertText(inputValue, text, 0, selectionEnd);
//         }

//         this.updateValue(event, newValueStr, text, 'insert');
//       }
//     } else if (sign.isDecimalSign) {
//       if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
//         this.updateValue(event, inputValue, text, 'insert');
//       } else if (
//         decimalCharIndex > selectionStart &&
//         decimalCharIndex < selectionEnd
//       ) {
//         newValueStr = this.insertText(
//           inputValue,
//           text,
//           selectionStart,
//           selectionEnd
//         );
//         this.updateValue(event, newValueStr, text, 'insert');
//       }
//     } else {
//       const maxFractionDigits =
//         this.numberFormat.resolvedOptions().maximumFractionDigits;
//       const operation =
//         selectionStart !== selectionEnd ? 'range-insert' : 'insert';

//       if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
//         if (
//           selectionStart + text.length - (decimalCharIndex + 1) <=
//           maxFractionDigits
//         ) {
//           newValueStr =
//             inputValue.slice(0, selectionStart) +
//             text +
//             inputValue.slice(selectionStart + text.length);
//           this.updateValue(event, newValueStr, text, operation);
//         }
//       } else {
//         newValueStr = this.insertText(
//           inputValue,
//           text,
//           selectionStart,
//           selectionEnd
//         );
//         this.updateValue(event, newValueStr, text, operation);
//       }
//     }
//   }

//   insertText(value: any, text: any, start: any, end: any) {
//     let textSplit = text.split('.');

//     if (textSplit.length == 2) {
//       const decimalCharIndex = value.slice(start, end).search(this._decimal);
//       this._decimal.lastIndex = 0;
//       return decimalCharIndex > 0
//         ? value.slice(0, start) + this.formatValue(text) + value.slice(end)
//         : value || this.formatValue(text);
//     } else if (end - start === value.length) {
//       return this.formatValue(text);
//     } else if (start === 0) {
//       return text + value.slice(end);
//     } else if (end === value.length) {
//       return value.slice(0, start) + text;
//     } else {
//       return value.slice(0, start) + text + value.slice(end);
//     }
//   }

//   deleteRange(value: any, start: any, end: any) {
//     let newValueStr;

//     if (end - start === value.length) newValueStr = '';
//     else if (start === 0) newValueStr = value.slice(end);
//     else if (end === value.length) newValueStr = value.slice(0, start);
//     else newValueStr = value.slice(0, start) + value.slice(end);

//     return newValueStr;
//   }

//   initCursor() {
//     let selectionStart = this.input.nativeElement.selectionStart;
//     let inputValue = this.input.nativeElement.value;
//     let valueLength = inputValue.length;
//     let index = null;

//     let char = inputValue.charAt(selectionStart);
//     if (this.isNumeralChar(char)) {
//       return;
//     }

//     //left
//     let i = selectionStart - 1;
//     while (i >= 0) {
//       char = inputValue.charAt(i);
//       if (this.isNumeralChar(char)) {
//         index = i;
//         break;
//       } else {
//         i--;
//       }
//     }

//     if (index !== null) {
//       this.input.nativeElement.setSelectionRange(index + 1, index + 1);
//     } else {
//       i = selectionStart + 1;
//       while (i < valueLength) {
//         char = inputValue.charAt(i);
//         if (this.isNumeralChar(char)) {
//           index = i;
//           break;
//         } else {
//           i++;
//         }
//       }

//       if (index !== null) {
//         this.input.nativeElement.setSelectionRange(index, index);
//       }
//     }
//   }

//   onInputClick() {
//     this.initCursor();
//   }

//   isNumeralChar(char: any) {
//     if (
//       char.length === 1 &&
//       (this._numeral.test(char) ||
//         this._decimal.test(char) ||
//         this._group.test(char) ||
//         this._minusSign.test(char))
//     ) {
//       this.resetRegex();
//       return true;
//     }

//     return false;
//   }

//   resetRegex() {
//     this._numeral.lastIndex = 0;
//     this._decimal.lastIndex = 0;
//     this._group.lastIndex = 0;
//     this._minusSign.lastIndex = 0;
//   }

//   updateValue(
//     event: any,
//     valueStr: any,
//     insertedValueStr: any,
//     operation: any
//   ) {
//     let currentValue = this.input.nativeElement.value;
//     let newValue = null;

//     if (valueStr != null) {
//       newValue = this.parseValue(valueStr);
//       this.updateInput(newValue, insertedValueStr, operation);
//     }

//     this.handleOnInput(event, currentValue, newValue);
//   }

//   handleOnInput(event: any, currentValue: any, newValue: any) {
//     if (this.isValueChanged(currentValue, newValue)) {
//       this.onInput.emit({ originalEvent: event, value: newValue });
//     }
//   }

//   isValueChanged(currentValue: any, newValue: any) {
//     if (newValue === null && currentValue !== null) {
//       return true;
//     }

//     if (newValue != null) {
//       let parsedCurrentValue =
//         typeof currentValue === 'string'
//           ? this.parseValue(currentValue)
//           : currentValue;
//       return newValue !== parsedCurrentValue;
//     }

//     return false;
//   }

//   validateValue(value: any) {
//     if (this.min != null && value < this.min) {
//       return this.min;
//     }

//     if (this.max != null && value > this.max) {
//       return this.max;
//     }

//     if (value === '-') {
//       // Minus sign
//       return null;
//     }

//     return value;
//   }

//   updateInput(value: any, insertedValueStr: any, operation: any) {
//     insertedValueStr = insertedValueStr || '';

//     let inputValue = this.input.nativeElement.value;
//     let newValue = this.formatValue(value);
//     let currentLength = inputValue.length;

//     if (currentLength === 0) {
//       this.input.nativeElement.value = newValue;
//       this.input.nativeElement.setSelectionRange(0, 0);
//       this.initCursor();
//       const prefixLength = (this.prefixChar || '').length;
//       const selectionEnd = prefixLength + insertedValueStr.length;
//       this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
//     } else {
//       let selectionStart = this.input.nativeElement.selectionStart;
//       let selectionEnd = this.input.nativeElement.selectionEnd;
//       if (this.maxlength && this.maxlength < newValue.length) {
//         return;
//       }

//       this.input.nativeElement.value = newValue;
//       let newLength = newValue.length;

//       if (operation === 'range-insert') {
//         const startValue = this.parseValue(
//           (inputValue || '').slice(0, selectionStart)
//         );
//         const startValueStr = startValue !== null ? startValue.toString() : '';
//         const startExpr = startValueStr.split('').join(`(${this.groupChar})?`);
//         const sRegex = new RegExp(startExpr, 'g');
//         sRegex.test(newValue);

//         const tExpr = insertedValueStr.split('').join(`(${this.groupChar})?`);
//         const tRegex = new RegExp(tExpr, 'g');
//         tRegex.test(newValue.slice(sRegex.lastIndex));

//         selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
//         this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
//       } else if (newLength === currentLength) {
//         if (operation === 'insert' || operation === 'delete-back-single')
//           this.input.nativeElement.setSelectionRange(
//             selectionEnd + 1,
//             selectionEnd + 1
//           );
//         else if (operation === 'delete-single')
//           this.input.nativeElement.setSelectionRange(
//             selectionEnd - 1,
//             selectionEnd - 1
//           );
//         else if (operation === 'delete-range' || operation === 'spin')
//           this.input.nativeElement.setSelectionRange(
//             selectionEnd,
//             selectionEnd
//           );
//       } else if (operation === 'delete-back-single') {
//         let prevChar = inputValue.charAt(selectionEnd - 1);
//         let nextChar = inputValue.charAt(selectionEnd);
//         let diff = currentLength - newLength;
//         let isGroupChar = this._group.test(nextChar);

//         if (isGroupChar && diff === 1) {
//           selectionEnd += 1;
//         } else if (!isGroupChar && this.isNumeralChar(prevChar)) {
//           selectionEnd += -1 * diff + 1;
//         }

//         this._group.lastIndex = 0;
//         this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
//       } else {
//         selectionEnd = selectionEnd + (newLength - currentLength);
//         this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
//       }
//     }

//     this.input.nativeElement.setAttribute('aria-valuenow', value);
//   }

//   onInputFocus(event: any) {
//     this.focused = true;
//     this.onFocus.emit(event);
//   }

//   onInputBlur(event: any) {
//     this.focused = false;

//     let newValue = this.validateValue(
//       this.parseValue(this.input.nativeElement.value)
//     );
//     this.input.nativeElement.value = this.formatValue(newValue);
//     this.input.nativeElement.setAttribute('aria-valuenow', newValue);
//     this.updateModel(event, newValue);

//     this.onBlur.emit(event);
//   }

//   formattedValue() {
//     return this.formatValue(this.value);
//   }

//   updateModel(event: any, value: any) {
//     if (this.value !== value) {
//       this.value = value;
//       this.onModelChange(value);
//     }

//     this.onModelTouched();
//   }

//   writeValue(value: any): void {
//     this.value = value;
//     this.cd.markForCheck();
//   }

//   registerOnChange(fn: Function): void {
//     this.onModelChange = fn;
//   }

//   registerOnTouched(fn: Function): void {
//     this.onModelTouched = fn;
//   }

//   setDisabledState(val: boolean): void {
//     this.disabled = val;
//     this.cd.markForCheck();
//   }

//   get filled() {
//     return this.value != null && this.value.toString().length > 0;
//   }

//   clearTimer() {
//     if (this.timer) {
//       clearInterval(this.timer);
//     }
//   }
// }
