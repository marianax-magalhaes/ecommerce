import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(private formBuilder: FormBuilder, private pottershopFormService: PottershopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
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
  }

  onSubmit(){
    console.log("Submetendo o formulario...");
    console.log(this.checkoutFormGroup.get('customer')!.value);
    console.log(this.checkoutFormGroup.get('customer')!.value.email);
  }

  copyShippingToBillingAddress(e: any){
    if(e.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value)
    } else{
      this.checkoutFormGroup.controls.billingAddress.reset();
    }

  }
}
