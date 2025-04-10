
import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '@/components/auth/RegistrationForm';
import { Card, CardContent } from '@/components/ui/card';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Créer un compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                se connecter avec un compte existant
              </Link>
            </p>
          </div>
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
