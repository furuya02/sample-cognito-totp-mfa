import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
import HomeView from "./HomeView";
Amplify.configure(awsExports);

function App() {
  return (
    <div>
      <HomeView />
    </div>
  );
}

export default withAuthenticator(App, { hideSignUp: true });
