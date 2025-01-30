import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlValueAccessor, FormControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn, } from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ngx-mat-select-advanced',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './ngx-mat-select-advanced.component.html',
  styles: `
  .new-option {
    font-weight: 600;
  }
  .mat-select-advanced {
    min-width: 240px;
  }
  .mat-mdc-form-field.mat-select-advanced-search {
    width: 100%;
  }
  .mat-select-advanced-panel {
    overflow-y: auto;
  }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxMatSelectAdvancedComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxMatSelectAdvancedComponent),
      multi: true,
    },
  ]
})
export class NgxMatSelectAdvancedComponent implements ControlValueAccessor, OnInit {

  @Input() options: string[] = []; // Options passed from parent
  @Input() label: string = 'Select an option'; // Label for the select field
  @Input() placeholder: string = 'Search or add new'; // Placeholder for search box
  @Input() allowAddNew: boolean = true; // Flag to enable/disable adding new options
  @Input() ariaLabel: string = ''; // Aria-label for accessibility
  @Input() defaultValue: string | null = null; // Default selected value
  @Input() pageSize: number = 20; // Number of items to load per scroll
  @Input() itemSize: number = 48; // Height of each item in the dropdown
  @Input() appearance: MatFormFieldAppearance = 'fill'; // Material appearance
  @Input() addNewLabel: string = 'Add'; // Label for adding new option button
  @Input() noOptionsLabel: string = 'No options available'; // Label for no options available
  @Input() validators: ValidatorFn[] = []; // Accept validators as an input

  @Output() newOptionAdded = new EventEmitter<string>(); // Emit new option added

  @Output() valueChange = new EventEmitter<string | null>();

  private onChange: any = () => {};

  private onTouched: any = () => {};

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  control: FormControl = new FormControl();
  filteredOptions: string[] = [];
  displayedOptions: string[] = []; // Options currently displayed in the dropdown
  rawOptions: string[] = [];
  searchText: string = '';
  selectedValue: string | null = null;
  showAddOption: boolean = false;
  
  ngOnInit(): void {
    if (!this.ariaLabel) {
      this.ariaLabel = this.label;
    }
    if (this.validators?.length) {
      this.control.setValidators(this.validators);
    }
    this.control.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && changes['options'].currentValue) {
      this.rawOptions = [...this.options];
      this.filteredOptions = [...this.options];
      this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];

      if (this.defaultValue && this.options.includes(this.defaultValue)) {
        this.selectedValue = this.defaultValue;
      } else if (this.options.length === 1) {
        this.selectedValue = this.options[0];
      }
      this.setFirstOption();
    }
  }

  ngOnDestroy() {
    this.control.reset();
  }

  filterOptions(search: string): void {
    this.searchText = search.trim();
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(this.searchText.toLowerCase()),
    );
    this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];
    this.showAddOption =
      this.allowAddNew && this.searchText !== '' && !this.options.includes(this.searchText);
  }

  addOption(option: string): void {
    if (this.allowAddNew && option.trim() && !this.options.includes(option)) {
      this.options.unshift(option);
      this.filteredOptions.push(option);
      this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];
      this.selectedValue = option;
      this.newOptionAdded.emit(option);
      this.control.setValue(this.selectedValue);
    }
  }

  onDropdownOpened(): void {
    if (this.searchInput) {
      this.searchText = '';
      this.showAddOption = false;
      this.filteredOptions = [...this.options];
      this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];
      this.searchInput.nativeElement.focus();
    }
  }

  clearSelection(): void {
    this.selectedValue = null;
    this.searchText = '';
    this.options = [...this.rawOptions];
    this.filteredOptions = [...this.options];
    this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];
    this.control.reset();
  }

  loadMore(): void {
    const currentLength = this.displayedOptions.length;
    const additionalOptions = this.filteredOptions.slice(
      currentLength,
      currentLength + this.pageSize,
    );
    this.displayedOptions = [...this.displayedOptions, ...additionalOptions];
  }

  onPanelScroll(event: Event): void {
    const panel = event.target as HTMLElement;
    const buffer = panel.clientHeight * 0.05;
    if (panel.scrollTop + panel.clientHeight >= panel.scrollHeight - buffer) {
      this.loadMore();
    }
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    this.control.registerOnChange(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.control.valid ? null : this.control.errors;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.control.statusChanges.subscribe(fn);
  }

  onValueChange(value: string): void {
    this.selectedValue = value;
    this.setFirstOption();
    this.onChange(value);
    this.onTouched();
  }

  setFirstOption(): void {
    if (this.selectedValue) {
      this.options = this.options.filter((option) => option !== this.selectedValue);
      this.options.unshift(this.selectedValue);
    }
    this.filteredOptions = [...this.options];
    this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];
    this.control.setValue(this.selectedValue);
  }
  
}