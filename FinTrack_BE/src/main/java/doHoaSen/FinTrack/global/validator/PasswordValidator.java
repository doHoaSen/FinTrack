package doHoaSen.FinTrack.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {
    private static final String LOWERCASE = ".*[a-z].*";
    private static final String DIGIT = ".*\\d.*";
    private static final String SPECIAL = ".*[!@#$%^&*(),.?\\\":{}|<>].*";

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context){
        if (password == null || password.length() < 6) return false;
        int typeCount = 0;

        if (password.matches(LOWERCASE)) typeCount++;
        if (password.matches(DIGIT)) typeCount++;
        if (password.matches(SPECIAL)) typeCount++;

        return typeCount >= 2;
    }
}
