import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, SimpleChanges, viewChild, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlValueAccessor, FormControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'ngx-mat-select-advanced',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule, ReactiveFormsModule],
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
  .overflow-y-auto {
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
export class NgxMatSelectAdvancedComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy, AfterViewInit {

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
  @Input() errorMessage: string = 'This field is required'; // Error message for validation
  @Input() isClearable: boolean = false; // Flag to show/hide clear selection button

  @Output() newOptionAdded = new EventEmitter<string>(); // Emit new option added

  @Output() valueChange = new EventEmitter<string | null>();

  private onChange: any = () => {};

  private onTouched: any = () => {};

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild('matSelect') matSelect!: MatSelect;

  control: FormControl = new FormControl();
  searchControl: FormControl = new FormControl();
  filteredOptions: string[] = [];
  displayedOptions: string[] = []; // Options currently displayed in the dropdown
  rawOptions: string[] = []; // Original options list
  selectedValue: string | null = null;
  showAddOption: boolean = false;
  
  ngOnInit(): void {
    if (!this.ariaLabel) {
      this.ariaLabel = this.label;
    }
    if (this.validators?.length) {
      this.control.setValidators(this.validators);
      this.searchControl.setValidators(this.validators);
      this.searchControl.removeValidators([Validators.required]);
    }
    this.control.updateValueAndValidity();

    this.searchControl.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
      this.filterOptions();
    });

    this.placeholder = this.placeholder.length > 25 ? this.placeholder.slice(0, 22) + '...' : this.placeholder;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && changes['options'].currentValue) {
      this.rawOptions = [...this.options];
      this.filteredOptions = [...this.options];
      this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];

      if (this.defaultValue && this.options.includes(this.defaultValue)) {
        this.selectedValue = this.defaultValue;
      }

      this.setFirstOption();
    }
  }

  ngOnDestroy() {
    this.control.reset();
    document.removeEventListener('keydown', this.onKeydown);
  }

  ngAfterViewInit(): void {
    this.matSelect.openedChange.subscribe((opened) => this.onDropdownOpened(opened));
  }

  onKeydown = (event: KeyboardEvent) => {
    const panel = document.querySelector('.mat-select-advanced-panel') as HTMLElement;
    if (!panel) return;

    if (event.key === 'ArrowDown') {
      panel.scrollTop += this.itemSize;
    } else if (event.key === 'ArrowUp') {
      panel.scrollTop -= this.itemSize;
    }
  }


  filterOptions(): void {
    const searchText = this.normalizeString(this.searchControl.value?.trim());
    this.filteredOptions = this.options.filter((option) =>
    {
      const normalizedOption = this.normalizeString(option);
      return normalizedOption.includes(searchText);
    }
    );
    this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];
    this.showAddOption =
      this.allowAddNew && searchText !== '' && !this.options.includes(searchText) && !this.displayedOptions.length;

      queueMicrotask(() => {
        this.matSelect._keyManager.setFirstItemActive();
      });
  }

  private normalizeString(searchText: string): string {
    return searchText.trim().toLowerCase();
  }

  addOption(): void {

    let option: string = this.searchControl.value;

    if (this.allowAddNew && option.trim() && !this.options.includes(option)) {
      this.options.unshift(option);
      this.filteredOptions.push(option);
      this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];
      this.selectedValue = option;
      this.newOptionAdded.emit(option);
      this.control.setValue(this.selectedValue);
    }

    this.showAddOption = false;

    this.matSelect.close();
  }

  onDropdownOpened(isOpen : boolean): void {
    if(isOpen){
      document.addEventListener('keydown', this.onKeydown);
      if (this.searchInput) {
        this.searchControl.reset();
        this.showAddOption = false;
        this.filteredOptions = [...this.options];
        this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];
        this.searchInput.nativeElement.focus();
     }

    } else {
      document.removeEventListener('keydown', this.onKeydown);
      this.filteredOptions = [...this.options];
      this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)];
    }

  }

  clearSelection(): void {
    this.selectedValue = null;
    this.searchControl.reset();
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
    this.valueChange.emit(value);
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

  onClosed(): void {
    this.searchControl.reset();
  }
  
}