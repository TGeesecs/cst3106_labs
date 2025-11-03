# Yatzy Game

## Overview
Yatzy is a classic dice game where players roll five dice to make combinations such as Three of a Kind, Full House, or Yatzy (five of a kind). Each combination awards points, and the player with the highest score after 13 rounds wins.

## Game Rules
- **Number of Dice:** 5  
- **Turns per Round:** Up to 3 rolls  
- **Goal:** Achieve the best possible combination each round  
- **Example Categories:** Ones, Twos, Full House, Small Straight, Yatzy  

## Design System
**Primary Color:** `#F4A261` (warm orange)  
**Secondary Color:** `#264653` (dark teal)  
**Font Choices:**  
- **Headings:** *Poppins Bold*  
- **Body:** *Open Sans Regular*  

These colors and fonts give the game a friendly, modern feel and ensure readability.

## Dice Design
- **Shape:** Square with rounded corners  
- **Base Color:** White with subtle shadow  
- **Dots (Pips):** Black circles centered according to the number  
- **Size:** 80 × 80 px

## Game Layout Mock-Up
The main screen includes:
- Dice area at the top  
- Scorecard on the right  
- Roll button at the bottom  

```html
<!-- Example snippet -->
<div class="dice-area">
  <div class="die">⚀</div>
  <div class="die">⚄</div>
</div>

