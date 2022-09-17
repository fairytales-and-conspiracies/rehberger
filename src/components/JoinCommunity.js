import SignUp from '@/components/SignUp';
import SocialMedia from '@/components/SocialMedia';

const JoinCommunity = () => {
  return (
    <div className="bg-primary bg-primary--no-min-height">
      <section className="join-community" id="join">
        <h1 className="join-community__heading">Join the Community</h1>
        <div className="join-community__right-section">
          <SignUp
            className="join-community"
            isJoinCommunity
            signUpText={
              <>
                Want an in on all the latest news regarding Fairytales &
                Conspiracies? Sign up for our newsletter to receive new
                information first hand.
              </>
            }
          />
          <SocialMedia large />
        </div>
      </section>
    </div>
  );
};

export default JoinCommunity;
