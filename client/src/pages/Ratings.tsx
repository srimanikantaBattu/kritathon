import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FiStar, FiCheckCircle } from "react-icons/fi";

type RatingCategory = {
  id: string;
  label: string;
  description: string;
  value: number;
};

export default function AgentFeedbackForm() {
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState<RatingCategory[]>([
    {
      id: "product-quality",
      label: "Product Quality",
      description: "How satisfied are you with the product quality?",
      value: 0,
    },
    {
      id: "service",
      label: "Service",
      description: "How would you rate the agent's service?",
      value: 0,
    },
    {
      id: "communication",
      label: "Communication",
      description: "How effective was the agent's communication?",
      value: 0,
    },
    {
      id: "timeliness",
      label: "Timeliness",
      description: "How satisfied are you with delivery timelines?",
      value: 0,
    },
    {
      id: "professionalism",
      label: "Professionalism",
      description: "How professional was the agent?",
      value: 0,
    },
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingChange = (categoryId: string, value: number) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === categoryId ? { ...cat, value } : cat))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({ ratings: categories, comment });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-900/20 to-emerald-900/10 border-emerald-800/50">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-emerald-400">
            Thank You for Your Feedback!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center space-y-4">
          <FiCheckCircle className="h-20 w-20 text-emerald-400" />
          <p className="text-zinc-300 text-lg">
            Your feedback helps us improve our services. We appreciate your time!
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalRating = categories.reduce((sum, cat) => sum + cat.value, 0) / categories.length;
  const isFormValid = totalRating > 0 && comment.trim().length > 10;

  return (
    <Card className="w-full max-w-5xl mx-auto bg-zinc-800/50 border-zinc-700/50 px-6">
      <CardHeader className="pb-0">
        <CardTitle className="text-3xl font-bold text-amber-400">
          Agent Feedback
        </CardTitle>
        <p className="text-zinc-400 text-lg">
          Please share your experience to help us improve
        </p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8 pt-6">
          {categories.map(category => (
            <div key={category.id} className="space-y-4 p-4 bg-zinc-800/30 rounded-lg">
              <div>
                <Label className="text-zinc-100 text-lg font-medium">{category.label}</Label>
                <p className="text-zinc-400 mt-1">{category.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(category.id, star)}
                    className="focus:outline-none transform hover:scale-110 transition-transform"
                  >
                    <FiStar
                      className={`h-9 w-9 ${
                        star <= category.value
                          ? "text-amber-400 fill-amber-400"
                          : "text-zinc-500"
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-4 text-zinc-300 text-lg font-medium">
                  {category.value > 0 ? `${category.value}/5` : "Not rated"}
                </span>
              </div>
            </div>
          ))}

          <div className="space-y-4 p-4 bg-zinc-800/30 rounded-lg">
            <div>
              <Label htmlFor="comment" className="text-zinc-100 text-lg font-medium">
                Additional Comments
              </Label>
              <p className="text-zinc-400 mt-1">
                Share more details about your experience (min. 10 characters)
              </p>
            </div>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or what could be improved?"
              className="bg-zinc-700/50 border-zinc-600 text-white min-h-[150px] text-lg"
              required
            />
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-lg border border-amber-800/50">
            <h3 className="text-zinc-300 font-medium text-lg mb-3">Your Overall Rating</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <FiStar
                    key={star}
                    className={`h-8 w-8 ${
                      star <= Math.round(totalRating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-zinc-500"
                    }`}
                  />
                ))}
              </div>
              <span className="text-zinc-100 text-xl font-bold">
                {totalRating > 0 ? `${totalRating.toFixed(1)}/5` : "Not rated yet"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-6">
          <Button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white text-lg h-12 px-8"
            disabled={!isFormValid}
          >
            Submit Feedback
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}