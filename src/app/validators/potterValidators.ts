import { FormControl, ValidationErrors } from "@angular/forms";


// validador customizado
export class potterValidators {
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors{

        // verificar se o input foi preenchido apenas com espacos em branco
        if((control.value != null) && (control.value.trim().length ===0)){
            return {'notOnlyWhiteSpace': true}
            
        } else{
            return {'notOnlyWhiteSpace': false}
        }
        
    }
}
