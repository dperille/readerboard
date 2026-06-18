# Readerboard

Love to read? Hate reducing your complex, objectively-correct opinions on books to out-of-5 star ratings? Tired of qualifying with fractional
stars in reviews nobody reads?

Readerboard lets you generate a decisive ranking of all your read books simply by comparing them head-to-head. No more "everything is 4 stars."
Somebody must win.

### Ratings

Ratings follow the original [Glicko system](https://www.glicko.net/glicko/glicko.pdf) devised by Dr. Mark Glickman. The model is akin to Elo:
each player has a rating, and results from head-to-head matches are used to adjust ratings up or down depending on the expected outcome given the
rating difference. For example, a 2000-elo player that defeats a 1000-elo player will see only a small rating increase since the result is expected, whereas
a loss in that matchup results in a significant rating decrease.

Glicko adds the dimension of confidence, called "rating deviation" (RD). The update to each player's rating after their match is not symmetric as it is
in Elo; rather, it depends on the degree of confidence in each player's rating. The default RD is 350, and decreases with every match (so a lower RD = more confident).
Glicko includes time decay of RD, which I have not implemented.

Why is this necessary? Compare two players: one has never played a match and so begins with the default rating of 1500, while the other has played hundreds of matches and
come back to a 1500 rating. A single win/loss for the former should cause a much larger rating shift since we have less confidence in their true ability. Likewise, their opponent in such a match
should see a smaller change since we have far less confidence in the difference between their underlying abilities. Concisely, beating a player we _think_ is good
is less impressive than beating a player we _know_ is good.

### Tech

The Glicko rating logic is written in Go and compiled to WebAssembly to run in-browser. There's no practical reason for this - the binary becomes huge for a small
amount of logic, likely isn't any faster, and makes the architecture unnecessarily complex - but I wanted to learn.

The frontend is built in React with the help of Tailwind and Shadcn. It holds no meaningful state and defers all rating logic & matchup selection to the Go rating engine.
It also acts as a proxy between saved sessions (either auto-saved to "persistent" local storage, or manually exported as JSON) and the Go engine, allowing users to save/resume.
