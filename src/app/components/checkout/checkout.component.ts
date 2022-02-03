import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { PottershopFormService } from 'src/app/services/pottershop-form.service';
import { potterValidators} from 'src/app/validators/potterValidators'

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

  // customer: Customer = {
  //   firstName: '',
  //   lastName: '',
  //   email: ''
  // }
    // firstName: any;
    // lastName: any;
    // email: any;
  

  constructor(private formBuilder: FormBuilder, private pottershopFormService: PottershopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = new FormGroup({
      customer: new FormGroup({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        email: new FormControl('', [Validators.required, Validators.pattern('/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i'), potterValidators.notOnlyWhiteSpace])
        // esse padrao do email é para validar o formato nome@email.com
      }),
      shippingAddress: new FormGroup({
        street: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        city: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        zipCode: new FormControl('', [Validators.required, Validators.minLength(6), potterValidators.notOnlyWhiteSpace]),

        state: new FormControl(null, [Validators.required,]),
        country: new FormControl(null, [Validators.required,])
      }),
      billingAddress: new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        zipCode: new FormControl('')
      }),
      creditCard: new FormGroup({
        cardType: new FormControl(''),
        nameOnCard: new FormControl(''),
        cardNumber: new FormControl(''),
        securityCode: new FormControl(''),
        expirationMonth: new FormControl(''),
        expirationYear: new FormControl('')
      })
    });

    // popular o mes do cartao
    const startMonth: number = new Date().getMonth() +1;
    console.log("mes inicial" + startMonth)

    this.pottershopFormService.getCrediCardMonths(startMonth).subscribe((data)=>{
      // console.log("meses recuperados: " + JSON.stringify(data));
      this.creditCardMonths = data
    })

    // popular o ano do cartao
    this.pottershopFormService.getCreditCardYears().subscribe((data)=>{
      // console.log("anos recuperados: " + JSON.stringify(data));
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

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipcode');}

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
