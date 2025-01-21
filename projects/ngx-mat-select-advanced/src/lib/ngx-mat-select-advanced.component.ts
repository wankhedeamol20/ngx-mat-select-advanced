import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, } from '@angular/forms';
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

  @Output() newOptionAdded = new EventEmitter<string>(); // Emit new option added

  @Output() valueChange = new EventEmitter<string | null>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  filteredOptions: string[] = [];
  displayedOptions: string[] = []; // Options currently displayed in the dropdown
  rawOptions: string[] = [];
  searchText: string = '';
  selectedValue: string | null = null;
  showAddOption: boolean = false;
  isDisabled: boolean = false; // Track disabled state

  private onChange: (value: string | null) => void = () => { };

  private onTouched: () => void = () => { };

  ngOnInit(): void {
   
    if (!this.ariaLabel) {
      this.ariaLabel = this.label; // Default aria-label to label if not provided
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && changes['options'].currentValue) {

      this.rawOptions = [...this.options];
      this.filteredOptions = [...this.options];
      this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)]; // Reset displayed options

      // Set default value if provided
      if (this.defaultValue && this.options.includes(this.defaultValue)) {
        this.selectedValue = this.defaultValue;
      }

      // If only one option, set to the option
      else if (this.options.length === 1) {
        this.selectedValue = this.options[0];
      }

      this.setFirstOption();
    }
  }

  filterOptions(search: string): void {
    this.searchText = search.trim();
    this.filteredOptions = this.options.filter(option =>
      option.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)]; // Reset displayed options
    this.showAddOption = this.allowAddNew && this.searchText !== '' && !this.options.includes(this.searchText);
  }

  addOption(option: string): void {
    if (this.allowAddNew && option.trim() && !this.options.includes(option)) {
      this.options.unshift(option);
      this.filteredOptions.push(option);
      this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)]; // Reset displayed options
      this.selectedValue = option;
      this.newOptionAdded.emit(option);
      this.onChange(option); // Notify form control
    }
  }

  onDropdownOpened(): void {
    setTimeout(() => {
      if (this.searchInput) {
        this.searchText = '';
        this.showAddOption = false;
        this.filteredOptions = [...this.options];
        this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)]; // Reset displayed options
        this.searchInput.nativeElement.focus();
      }
    }, 0); // Ensures the focus happens after the panel is fully opened
  }

  clearSelection(): void {
    this.selectedValue = null;
    this.searchText = '';
    this.options = [...this.rawOptions];
    this.filteredOptions = [...this.options];
    this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)]; // Reset displayed options
    this.onChange(null);
    this.onTouched();
  }

  onValueChange(value: string): void {
    this.selectedValue = value;
    this.setFirstOption();
    this.valueChange.emit(value); // Emit the value change event
    this.onTouched(); // Mark control as touched
  }

  loadMore(): void {
    const currentLength = this.displayedOptions.length;
    const additionalOptions = this.filteredOptions.slice(currentLength, currentLength + this.pageSize);
    this.displayedOptions = [...this.displayedOptions, ...additionalOptions];
  }

  onPanelScroll(event: Event): void {
    const panel = event.target as HTMLElement;
    const buffer = panel.clientHeight * 0.05; // 5% of the visible height
    if (panel.scrollTop + panel.clientHeight >= panel.scrollHeight - buffer) {
      this.loadMore();
    }
  }

  writeValue(value: string | null): void {
    this.selectedValue = value;
    if (value) {
      this.onChange(value);
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setFirstOption(): void {
    // Ensure selectedValue is the first element of options
    if (this.selectedValue) {
      // Remove the selectedValue from the options array if it exists
      this.options = this.options.filter(option => option !== this.selectedValue);
      // Insert the selectedValue at the beginning of the options array
      this.options.unshift(this.selectedValue);
    }
    this.filteredOptions = [...this.options];
    this.displayedOptions = [...this.filteredOptions.slice(0, this.pageSize)]; // Reset displayed options
    this.onChange(this.selectedValue); // Notify form control
  }
}