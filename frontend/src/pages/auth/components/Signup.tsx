import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { toast } from 'sonner';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signupSchema } from '../../../forms/signupSchema';
import { useSignupMutation } from '../../../api/auth';
import { useRef, useState } from 'react';
import { api as imageApi } from '../../../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const [picLoading, setPicLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmpassword: '', pic: '' }}
        validationSchema={signupSchema}
        onSubmit={async (values, { setSubmitting, setFieldValue }) => {
          try {
            let imageUrl = values.pic;
            if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
              setPicLoading(true);
              const result = await imageApi.uploadImage(fileInputRef.current.files[0]);
              if (result.success && result.data) {
                imageUrl = result.data.url;
                setFieldValue('pic', imageUrl);
              } else {
                throw new Error(result.error || 'Image upload failed');
              }
              setPicLoading(false);
            }
            await signupMutation.mutateAsync({ ...values, pic: imageUrl });
            toast.success('Account created successfully!');
            navigate('/chats');
          } catch (error: any) {
            toast.error(
              error?.response?.data?.message || error.message || 'Signup failed. Please try again.'
            );
          } finally {
            setSubmitting(false);
            setPicLoading(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4 typography">
            <div>
              <label className='!text-xs'>Name</label>
              <Field as={Input} name="name" placeholder="Enter Your Name" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className='!text-xs'>Email Address</label>
              <Field as={Input} name="email" type="email" placeholder="Enter Your Email Address" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className='!text-xs'>Password</label>
              <Field as={Input} name="password" type="password" placeholder="Enter Password" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className='!text-xs'>Confirm Password</label>
              <Field as={Input} name="confirmpassword" type="password" placeholder="Confirm Password" />
              <ErrorMessage name="confirmpassword" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className='!text-xs'>Profile Picture (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFieldValue('pic', e.target.files[0].name);
                  }
                }}
              />
            </div>
            <Button type="submit" disabled={isSubmitting || picLoading || signupMutation.status === 'pending'} style={{ marginTop: 15, width: '100%' }}>
              {isSubmitting || picLoading || signupMutation.status === 'pending' ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Signup;
