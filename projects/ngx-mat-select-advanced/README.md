
## Angular Material Select with search, lazy loading and dynamic options.

A reusable Angular library that extends [Angular Material's mat-select](https://material.angular.io/components/select) with advanced features like search, lazy loading, and the ability to add custom options.

### Features
* **Search Functionality:** Easily search through options in the dropdown.
* **Lazy Loading:** Efficiently load options in chunks to handle large datasets.
* **Custom Option Addition:** Add new options dynamically if they are not available.
* **Cross Button:** Clear the selected value with a single click.
* **Accessibility:** Fully accessible with proper aria-label attributes.

### Installation  

```bash
npm i ngx-mat-select-advanced
```

### Inputs  

| Input | Type  | Default | Description |  
| ----- | ----- | ----- | ----- |
| `options` | `string[]`| `[]` | Array of options to display in the dropdown. |
| `label` | `string` | `'Select an option'` | Label for the select component. |
| `placeholder` |  `string` | `'Search or add new'`  | Placeholder for the search input. | 
| `allowAddNew` | `boolean` | `true` | Allow adding a new option if not found in the list. |
| `ariaLabel` | `string` | `''` | Accessibility label for the component. |
| `pageSize` | `number` | `5` | Number of options to load per lazy-loading batch. |
| `itemSize` | `number` | `48` | Set options height. |
| `appearance` | `string` | `fill` | Set form feild style `'fill' or 'outline'` . |
| `addNewLabel` | `string` | `Add` | Set label for new option. |



### Outputs  

| Output | Description | Type |
| ----- | ----- | ----- |  
| `newOptionAdded`  | Emits the new option added by the user.        | `EventEmitter<string>`  |
| `valueChange` | Emits the selected value whenever it changes. | `EventEmitter<string>` |



### Usage  

[StackBlitz working example](https://stackblitz.com/~/github.com/wankhedeamol20/ngx-mat-select-advanced?file=projects/example-app/src/app/app.component.ts)  

Import `NgxMatSelectAdvancedComponent` inside the `app.component.ts`:  
```typescript
.
.
.
import { NgxMatSelectAdvancedComponent } from 'ngx-mat-select-advanced';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [..., NgxMatSelectAdvancedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      colors: ['Gray'],
    });
  }

  form: FormGroup;

  colors: string[] = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown", "Gray", "Black", "White", "Cyan", "Magenta", "Lime", "Teal", "Olive", "Maroon", "Navy", "Gold", "Silver"];

  onNewColorAdded(newColor: string): void {
    console.log('New color added:', newColor);
  }

  onColorValueChange(value: string | null): void {
    console.log('Selected color value:', value);
  }
}
```

Then, add html inside `app.componet.html`  
```html
  <form [formGroup]="form">
      <ngx-mat-select-advanced 
        formControlName="colors" 
        ngDefaultControl 
        [options]="colors" 
        [label]="'Colors'"
        [placeholder]="'Search or add a color'" 
        [allowAddNew]="true" 
        [defaultValue]="'Gray'" 
        [pageSize]="5"
        [itemSize]="48" 
        [appearance]="'outline'" 
        [addNewLabel]="'Add'" 
        (newOptionAdded)="onNewColorAdded($event)"
        (valueChange)="onColorValueChange($event)">
      </ngx-mat-select-advanced>
  </form>
```

### Advanced Features
* **Lazy Loading:** The library automatically handles lazy loading. Options are loaded in chunks as the user scrolls to the bottom of the dropdown.
* **Adding Custom Options:** If the user enters a value not in the list, the library provides an option to add it dynamically. To disable this, set `allowAddNew` to `false`.

### Development
To run and test the library locally:

1. Clone the repository:
```bash
git clone https://github.com/wankhedeamol20/ngx-mat-select-advanced
```
2. Navigate to the workspace:
```bash
cd ngx-mat-select-advanced
```
3. Install dependencies:
```bash
npm install
```
4. Build the library:
```bash
ng build ngx-mat-select-advanced
```
5. Link the library to a demo project for testing:
```bash
cd dist/ngx-mat-select-advanced
npm link
```
6. In your Angular demo project:
```bash
npm link ngx-mat-select-advanced
```

### Compatibility  

This library supports Angular 18 and higher.  
* `@angular/core`: `>=18.2.0`  
* `@angular/cdk`: `>=18.2.0`  
* `@angular/material`: `>=18.2.0`  

### Contributions  

Contributions are welcome! If you encounter any issues or have feature requests, please open an issue or create a pull request.

### License  
This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
 