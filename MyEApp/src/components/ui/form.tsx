// form.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import {
  useForm,
  FormProvider,
  Controller,
  FieldValues,
  FieldPath,
} from 'react-hook-form';

interface FormProps {
  /** The default values for your form fields. */
  defaultValues: Record<string, any>;
  /** Called on form submit. */
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
}

/**
 * A minimal Form component using react-hook-form's FormProvider in RN.
 */
export function Form({ defaultValues, onSubmit, children }: FormProps) {
  const methods = useForm({ defaultValues });

  const handleSubmit = methods.handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      <View style={styles.form}>{children}</View>
      {/* You can trigger handleSubmit in a button onPress, etc. */}
    </FormProvider>
  );
}

/**
 * A minimal "FormField" that uses react-hook-form's Controller.
 */
interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label?: string;
  rules?: object;
  defaultValue?: any;
  render: (fieldProps: {
    value: any;
    onChange: (val: any) => void;
    onBlur: () => void;
  }) => JSX.Element;
}

export function FormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  defaultValue,
  render,
}: FormFieldProps<TFieldValues>) {
  return (
    <View style={styles.formItem}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Controller
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => render(field)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    // Container for the entire form
  },
  formItem: {
    marginVertical: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
});
