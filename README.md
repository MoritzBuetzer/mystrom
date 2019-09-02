# MyStrom Observer
Simple script to observe MyStrom-Switches.
Not yet finished, more a PoC to test the Switches.

## Start forever
`forever start scripts/observer.js`

## IFTTT Applet
Create a new Applet: 'If Maker Event "mystrom", then Send a notification from the IFTTT app', Message: "[{{Value1}}]: {{Value2}} @ {{Value3}}W {{OccurredAt}}"