import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { Customer } from 'src/app/common/customer';
import { State } from 'src/app/common/state';
import { PottershopFormService } from 'src/app/services/pottershop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number =0;

  creditCardYears: number[]=[];
  creditCardMonths: number[]=[];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  
    // firstName: any;
    // lastName: any;
    // email: any;
  

  constructor(private formBuilder: FormBuilder, private pottershopFormService: PottershopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [null, [Validators.required, Validators.minLength(2)]],
        lastName: [null, [Validators.required, Validators.minLength(2)]],
        email: [null, [Validators.required, Validators.pattern('ˆ[a-z0-9._%+-] + @[a-z0-9.-] + \\.[a-z]{2,4)$')]]
        // esse padrao do email é para validar o formato nome@email.com
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    // popular o mes do cartao
    const startMonth: number = new Date().getMonth() +1;
    console.log("mes inicial" + startMonth)

    this.pottershopFormService.getCrediCardMonths(startMonth).subscribe((data)=>{
      console.log("meses recuperados: " + JSON.stringify(data));
      this.creditCardMonths = data
    })

    // popular o ano do cartao
    this.pottershopFormService.getCreditCardYears().subscribe((data)=>{
      console.log("anos recuperados: " + JSON.stringify(data));
      this.creditCardYears = data
    })

    // popular paises
    this.pottershopFormService.getCountries().subscribe((data)=>{
      console.log("paises recuperados do bd: " + JSON.stringify(data));
      this.countries=data;
    })
  }

  onSubmit(){
    console.log("Submetendo o formulario...");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    
    console.log(this.checkoutFormGroup.get('customer')!.value);
    console.log(this.checkoutFormGroup.get('customer')!.value.email);
    console.log(this.checkoutFormGroup.get('shippingAddress')!.value.country.name);
    console.log(this.checkoutFormGroup.get('shippingAddress')!.value.state.name);
    console.log("------------------------")
  }

  getFirstName(){return this.checkoutFormGroup.get('customer.firstName');}
  getLastName(){return this.checkoutFormGroup.get('customer.lastName');}
  getEmail(){return this.checkoutFormGroup.get('customer.email');}

  copyShippingToBillingAddress(e: any){
    if(e.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value)
    } else{
      this.checkoutFormGroup.controls.billingAddress.reset();
    }

  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();const selectedYear: number = Number(creditCardFormGroup!.value.expirationYear);

    // se ano atual é igual ao ano escolhido, entao comecar o mes no mes atual

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() +1;
    } else{
      startMonth = 1;
    }

    this.pottershopFormService.getCrediCardMonths(startMonth).subscribe((data)=>{
      console.log("JSON.stringify(data)")
      this.creditCardMonths = data;
    })
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup!.value.country.code;
    const countryName = formGroup!.value.country.name;

    console.log("country code: " + countryCode + " country name: " + countryName);

    this.pottershopFormService.getStates(countryCode).subscribe((data)=>{
      if(formGroupName === 'shippingAddress'){
        this.shippingAddressStates = data;
      } else{
        this.billingAddressStates = data;
      }

      // deixar o primeiro estado selecionado por default
      formGroup!.get('state')!.setValue(data[0]);
    })
  }
}
