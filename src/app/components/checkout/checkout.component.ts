import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
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
  

  constructor(private formBuilder: FormBuilder, 
    private pottershopFormService: PottershopFormService, 
    private cartService: CartService, 
    private checkoutService: CheckoutService, 
    private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = new FormGroup({
      customer: new FormGroup({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        // essas expressoes de pattern chama-se regex
        email: new FormControl('', [Validators.required, Validators.pattern('/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i'), potterValidators.notOnlyWhiteSpace])
        // esse padrao do email é para validar o formato nome@email.com
      }),

      shippingAddress: new FormGroup({
        street: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        city: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        zipCode: new FormControl('', [Validators.required, Validators.minLength(2)]),

        state: new FormControl(null, [Validators.required,]),
        country: new FormControl(null, [Validators.required,])
      }),

      billingAddress: new FormGroup({
        street: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        city: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),

        state: new FormControl(null, [Validators.required,]),
        country: new FormControl(null, [Validators.required,])
      }),

      creditCard: new FormGroup({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), potterValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
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
    console.log("teste");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // montar o pedido
    let order: Order = {
      totalQuantity: 0,
      totalPrice: 0,
    };
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // pegar os itens do carrinho
    const cartItems = this.cartService.cartItems;

    // criar orderItms a partir de cartItems
    let orderItems: OrderItem[]=[];
    for (let i=0; i< cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    // criar purchase
    let purchase = new Purchase();

    // popular purchase com cliente
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // popular purchase com o endereco de entrega
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // popular purchase com o endereco de cobranca de
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // popular purchase com order e orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // chamar a API
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert("Pedido recebido! No: " + response.orderTrackingNumber)

        this.resetCart();
      },
      error: err => {
        alert("Erro no pedido, tente mais tarde! " + err.message)
      }
    })
  }

  resetCart(){
    // resetar o carrinho e o formulario e voltar para pag principal
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigate(['/products']);
  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipcode');}

  get billingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get billingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipcode');}

  get creditCardType(){return this.checkoutFormGroup.get('creditcard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditcard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditcard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditcard.securityCode');}

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

  reviewCartDetails(){
    this.cartService.totalQuantity.subscribe((totalQuantity) => this.totalQuantity = totalQuantity);
    this.cartService.totalPrice.subscribe((totalPrice) => this.totalPrice = totalPrice);
  }
}
