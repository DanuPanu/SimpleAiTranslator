import { Button, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormControl, Spinner } from "react-bootstrap";
import OpenAI from "openai";
import { useState } from "react";
import kielet from './kielet'

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true
});

const App : React.FC = () : React.ReactElement => {

  const [cbResponse, setCbResponse] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userInput, setUserInput] = useState<string>("")
  const [language, setLanguage] = useState<string>("English")

  const kokeilu = async () => {
    if(userInput != ""){
      setIsLoading(true)
      const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
              { role: "system", content: "You are a translator" },
              {
                  role: "user",
                  content: `Translate this: "${userInput}" to ${language}. Only give the translation and without the quotation marks. If you dont understand the text or if there are a lot of spelling mistakes you can answer: Check your input for spelling`,
              },
          ],
      });
      setCbResponse(completion.choices[0].message.content);
      setIsLoading(false)
    }else{
      setCbResponse("Give an input to receive a translation.")
    }
  }

  const clickHandler = (kieli : string) => {
    setLanguage(kieli)
  }

  return (
    <Container style={{margin: 30}}>
     <Dropdown style={{marginBottom: 10}}>
      <DropdownToggle variant="primary" id="dropdown-basic">
        Select Language
      </DropdownToggle>

      <DropdownMenu>
        {kielet.map((language : any) => (
          <DropdownItem onClick={() => clickHandler(language.name)} key={language.code}>
            {language.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
    <h5>Language to translate to: {language}</h5>
      <Form className="mt-3" onSubmit={kokeilu}>
        <FormControl
          style={{width: "80%"}}
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
        /> 
      </Form>
      <Button style={{marginTop: 10, marginBottom: 10, width: "200px"}} onClick={kokeilu}>Translate</Button>

      <div>
        {isLoading ?
          <Spinner/>
          :
          cbResponse
        }
      </div>
    </Container>
  )
}

export default App;