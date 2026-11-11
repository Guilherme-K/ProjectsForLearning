"""Jogo de adivinhação com números aleatórios."""

import random

print("=" * 46)
print("  Jogo de adivinhação")
print("=" * 46)
print("Pensei em um número inteiro entre 1 e 100.")
print("Tente acertar usando as dicas de maior e menor.\n")

segredo = random.randint(1, 100)
tentativas = 0

while True:
    entrada = input("Seu palpite: ").strip()

    if not entrada.isdigit():
        print("Digite apenas números inteiros.")
        continue

    palpite = int(entrada)
    tentativas += 1

    if palpite < 1 or palpite > 100:
        print("O número está entre 1 e 100.")
    elif palpite < segredo:
        print(f"{palpite} é menor que o número secreto.")
    elif palpite > segredo:
        print(f"{palpite} é maior que o número secreto.")
    else:
        print(f"\nAcertou! O número era {segredo}.")
        print(f"Você usou {tentativas} tentativa(s).")
        break
