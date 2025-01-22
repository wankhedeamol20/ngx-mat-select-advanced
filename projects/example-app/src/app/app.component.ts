import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxMatSelectAdvancedComponent } from '../../../ngx-mat-select-advanced/src/public-api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, NgxMatSelectAdvancedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      colors: ['Gray'],
      cities: [null]
    });
  }

  form: FormGroup;

  area: string[] = [];

  colors: string[] = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown", "Gray", "Black", "White", "Cyan", "Magenta", "Lime", "Teal", "Olive", "Maroon", "Navy", "Gold", "Silver"];

  cities: string[] = [
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune",
    "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
    "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot",
    "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar",
    "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior",
    "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur",
    "Hubballi-Dharwad", "Bareilly", "Moradabad", "Mysore", "Tiruchirappalli", "Tiruppur",
    "Salem", "Aligarh", "Thiruvananthapuram", "Bhiwandi", "Saharanpur", "Guntur", "Amravati",
    "Bikaner", "Noida", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi", "Bhavnagar",
    "Dehradun", "Durgapur", "Asansol", "Nanded", "Kolhapur", "Ajmer", "Gulbarga", "Jamnagar",
    "Ujjain", "Loni", "Siliguri", "Jhansi", "Ulhasnagar", "Nellore", "Jammu", "Sangli",
    "Belgaum", "Mangalore", "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Jalgaon", "Udaipur",
    "Maheshtala", "Davanagere", "Kozhikode", "Kurnool", "Rajpur Sonarpur", "Bokaro", "South Dumdum",
    "Bellary", "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar", "Bhatpara",
    "Panihati", "Latur", "Dhule", "Rohtak", "Korba", "Bhilwara", "Berhampur", "Muzaffarpur",
    "Ahmednagar", "Mathura", "Kollam", "Avadi", "Kadapa", "Kamarhati", "Sambalpur",
    "Bilaspur", "Shahjahanpur", "Satara", "Bijapur", "Rampur", "Shimoga", "Chandrapur",
    "Junagadh", "Thrissur", "Alwar", "Bardhaman", "Kulti", "Kakinada", "Nizamabad",
    "Parbhani", "Tumkur", "Khammam", "Uzhavoor", "Ongole", "Naihati", "Dibrugarh", "Purnia",
    "Ambarnath", "Satna", "Singrauli", "Karimnagar", "Bihar Sharif", "Panipat", "Darbhanga",
    "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Tirupati", "Karnal", "Bathinda", "Jalna",
    "Eluru", "Barasat", "Kirari Suleman Nagar", "Pilibhit", "Sikar", "Tumkur", "Rewa",
    "Satara", "Mau", "Adoni", "Imphal", "Latur", "Bilaspur", "Mathura", "Bardhaman",
    "Karawal Nagar", "Guntur", "Tiruvannamalai", "Madhyamgram", "Bhiwadi", "Nagercoil",
    "Farrukhabad", "Rewa", "Bijapur", "Durg", "Shimla", "Sikar", "Firozabad", "Kumbakonam",
    "Anantapur", "Nadiad", "Alappuzha", "Bardhaman", "Tinsukia", "Tonk"
  ];

  onNewColorAdded(newColor: string): void {
    console.log('New color added:', newColor);
  }

  onColorValueChange(value: string | null): void {
    console.log('Selected color value:', value);
  }

  onNewCityAdded(newCity: string): void {
    console.log('New city added:', newCity);
  }

  onCitiesValueChange(value: string | null): void {
    console.log('Selected city value:', value);
  }

  onNewAreaAdded(newCity: string): void {
    console.log('New area added:', newCity);
  }

  onAreaValueChange(value: string | null): void {
    console.log('Selected area value:', value);
  }

  test() {
    console.log('test', this.form.value);
  }
}
