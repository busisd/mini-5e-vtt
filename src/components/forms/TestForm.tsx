import { Field, Form, Formik } from "formik";
import { Stat } from "../../types/stats";

const TestForm = () => {
  return (
    <Formik
      initialValues={{}}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {() => (
        <Form>
          <Field as="select" name="stat" placeholder="test">
            <option value={""}>-- Select a stat --</option>
            {Object.entries(Stat).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Field>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default TestForm;
