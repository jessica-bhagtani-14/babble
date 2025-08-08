import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { toast } from 'sonner';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginSchema } from '../../../forms/loginSchema';
import { useLoginMutation } from '../../../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await loginMutation.mutateAsync(values);
            toast.success('Login Successful');
            navigate('/chats');
          } catch (error: any) {
            toast.error(
              error?.response?.data?.message || error.message || 'Login failed. Please try again.'
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4 typography">
            <div>
              <label className='!text-xs'>Email Address</label>
              <Field
                as={Input}
                name="email"
                type="email"
                placeholder="Enter Your Email Address"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className='!text-xs'>Password</label>
              <Field
                as={Input}
                name="password"
                type="password"
                placeholder="Enter password"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <Button type="submit" disabled={isSubmitting || loginMutation.status === 'pending'} className='w-full'>
              {isSubmitting || loginMutation.status === 'pending' ? 'Signing in...' : 'Sign In'}
            </Button>
            <Button
              variant="outline"
              type="button"
              className='w-full'
              onClick={() => {
                setFieldValue("email", "guest@example.com");
                setFieldValue("password", "123456");
              }}
            >
              Join as Guest
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;
