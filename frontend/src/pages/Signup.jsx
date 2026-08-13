import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault()
    console.log(formData);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/register`, formData, {
        headers:{
            "Content-Type":"application/json"
          }
        }
      );
      if (res.data.success) {
        navigate('/verify')
        toast.success(res.data.message)
      }
      
    } catch (error) {
     console.log(error);
     
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen font-serif ">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-serif text-center">
            Create your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter Your Details to Create Your Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gamil.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Create a Password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className="w-5 h-5 text-black-700 absolute right-4 bottom-2 "
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className="w-5 h-5 text-black-700 absolute right-4 bottom-2 "
                    />
                  )}
                </div>
              </div>
            </div>
          
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={submitHandler} type="submit" className="w-full cursor-pointer bg-black hover:bg-gray-500">
            Signup
          </Button>
          <p className="text-gray-700 text-sm">
            Already Have an Account?{" "}
            <Link
              to="/login"
              className="text-blue-700 hover:underline cursor-pointer"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
