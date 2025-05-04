import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Job } from "@/apis/jobApi";

interface Props {
  job: Job;
}

export function JobDetails({ job }: Props) {
  return (
    <Card className="max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-3xl">{job.title}</CardTitle>
        <CardDescription className="flex items-center space-x-2">
          <span>{job.company_name}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>{job.location}</span>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline">{job.contract_type}</Badge>
        </CardDescription>
        <CardDescription>
          <span className="font-medium">Application Deadline:</span>{" "}
          {job.application_deadline ?? "—"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{job.job_description}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Skills Required</h2>
          <p className="text-gray-700">{job.required_skills}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Experience Required</h2>
          <p className="text-gray-700">{job.required_experience}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Education Required</h2>
          <p className="text-gray-700">{job.required_education}</p>
        </section>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button asChild>
          <Link to={`/jobs/${job.id}/apply`}>Apply Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
