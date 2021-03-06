chimerical-colors
=================

Javascript code to allow you to see impossible colors.

The relevant paper is "Chimerical Colors: Some Phenomenological Predictions from Cognitive Neuroscience" by Paul Churchland, in the journal Philosophical Psychology, Vol. 18 No. 5, October 2005, pp. 527-560.

The basic idea is that there are several models for how our eyes process colors, but the best reason to believe in a model is to have it predict something unexpected, then go out and test to see if the unexpected thing really happens.

One model of human color recognition is the Hurvich-Jameson opponent-process network. The surprising thing it predicts is that it should be possible to "see" colors that are not actually possible colors of any real-world object. This is done by wearing out certain receptors in your eyes and then quickly looking at a certain background color. The resulting image will be a color that we would normally think of impossible, like a brilliant blue that is somehow also pitch-black.

The code here will do a couple of things. 

First, we want a model that allows you to input S, M, L, and B (short, medium, long-wavelength excitement and general brightness) and get an output of Agr, Aby, and Awb, which parameterize how we actually see color according to the H-J model. If you input S, M, L, and B with various real-world values, then we hope to be able to see that the possible outputs do not completely fill the target space parametrized by Agr, Aby, and Abw.

Then, we want to actually set up the mechanisms that allow us to see the colors outside of this target, like the impossibly-dark blues. Basically we should be able to pick a tuple Agr, Aby, and Awb, and then the code should show us two images in order that allow us to experience the weird color.
