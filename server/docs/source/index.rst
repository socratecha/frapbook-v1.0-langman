Langman documentation
=====================

Flask Server API
----------------

.. automodule:: server.api
   :members:

Database ORM and Schema
-----------------------

.. automodule:: server.langman_orm
   :members:

Client Stylesheet
-----------------

`Storybook Stylesheet <_static/storybook-static/index.html>`_
(Requires JavaScript)


Client Application
------------------
The following describes the JavaScript client.

.. js:module:: App

.. js:class:: App

   .. js:method:: constructor(props)

      The React lifecycle method to initialize the component.  Sets
      the state ``gameStatus`` to 'logged out'.  Also, binds methods.

      :param props object: The collection of properties for the
                           object, which are typically set using JSX
                           within a render method, but for this top
                           level component come directly from React.

   .. js:method:: startGame(nameValue, langValue)

      Contacts server to start a new game, then updates state accordingly.

      :param nameValue string: Name of player
      :param langValue string: Two-letter string indicating language choice

      State is set for ``username``, ``language``, ``gameId``,
      ``badGuesses``, ``guessed``, ``playerId``, ``revealWord``,
      ``usage``, and ``gameStatus``.

   .. js:method:: guessLetter(letter)

      Contacts server to guess a letter, then updates state accordingly.

      :param letter string: A single-character string of a letter to guess

      State is set for ``badGuesses``, ``guessed``, ``revealWord``,
      ``gameStatus``, and ``secretWord``.  Note that ``gameStatus``
      will potentially update the game screen.

   .. js:method:: playAgain(langValue)

      Start a new game by calling the ``startGame`` method using the
      current username and the possibly new ``langValue``

      :param langValue string: Two-letter string indicating language choice

   .. js:method:: quitGame()

      Set the ``gameStatus`` state back to 'logged out'

   .. js:method:: render()

      The React lifecycle method to render the component.  It chooses
      the screen based on the ``gameStatus``.


.. toctree::
   :maxdepth: 2
   :caption: Contents:


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
