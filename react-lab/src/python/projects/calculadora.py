"""Sistema simples de cadastro em memória, com tratamento de erros."""

import sys
import time


# Este banco de dados é uma lista em memória: os dados são perdidos ao fechar
# o programa. Ele começa com alguns registros para já estar alimentado.
banco_de_dados = [
    {"id": 1, "nome": "Ana"},
    {"id": 2, "nome": "Bruno"},
    {"id": 3, "nome": "Carla"},
]


def inserir():
    """Pede um nome e adiciona um novo registro ao banco."""
    while True:
        try:
            nome = input("Digite o nome: ").strip()
            if not nome:
                raise ValueError("O nome não pode ficar vazio.")
            if not any(caractere.isalpha() for caractere in nome):
                raise ValueError("O nome precisa conter pelo menos uma letra.")

            proximo_id = max(
                (registro["id"] for registro in banco_de_dados), default=0
            ) + 1
            banco_de_dados.append({"id": proximo_id, "nome": nome})
            print(f'Registro de {nome} inserido com o ID {proximo_id}.')
            break
        except ValueError as erro:
            print(f"Não foi possível inserir: {erro} Tente novamente.")


def excluir():
    """Remove um registro usando o seu ID."""
    try:
        id_para_excluir = int(input("Digite o ID que deseja excluir: "))
        for registro in banco_de_dados:
            if registro["id"] == id_para_excluir:
                banco_de_dados.remove(registro)
                print(f"Registro de ID {id_para_excluir} excluído.")
                return

        print(f"Não existe registro com o ID {id_para_excluir}.")
    except ValueError:
        print("ID inválido. Digite um número inteiro.")


def exibir():
    """Mostra todos os registros cadastrados."""
    if not banco_de_dados:
        print("O banco de dados está vazio.")
        return

    print("\n--- Registros cadastrados ---")
    for registro in banco_de_dados:
        print(f'ID: {registro["id"]} | Nome: {registro["nome"]}')


def exibir_por_id():
    """Mostra um registro específico usando o seu ID."""
    try:
        id_pesquisado = int(input("Digite o ID que deseja consultar: "))
        for registro in banco_de_dados:
            if registro["id"] == id_pesquisado:
                print(f'ID: {registro["id"]} | Nome: {registro["nome"]}')
                return

        print(f"Não existe registro com o ID {id_pesquisado}.")
    except ValueError:
        print("ID inválido. Digite um número inteiro.")


def imagem_ascii():
    """Imprime um desenho em ASCII."""
    print(r"""                       -                                                        @
 ( -_•)︻デ═一      -                        @                                 ][
          /\                                ][                         -                    @
                                                                                            ][
 """)


def animacao_ascii_legal():
    """Mostra uma danca ASCII com movimentos e estrelas por 30 segundos."""
    quadros = [
        r"""
   \o/       *
    |       /|\\
   / \\       |
""",
        r"""
    o/      *  *
   /|       /|\\
   / \\       |
""",
        r"""
  \\o       *
    |\\      /|\\
   / \\       |
""",
        r"""
   \\o/    *  *
    |\\      /|\\
   / \\       |
""",
    ]

    inicio = time.monotonic()
    passo = 0
    while time.monotonic() - inicio < 30:
        sys.stdout.write("\033[2J\033[H")
        sys.stdout.write("Danca ASCII!\n\n")
        sys.stdout.write(quadros[passo % len(quadros)])
        sys.stdout.flush()
        passo += 1
        tempo_restante = 30 - (time.monotonic() - inicio)
        time.sleep(min(0.3, max(0, tempo_restante)))


def menu():
    while True:
        print("\n=== Sistema de cadastro ===")
        print("1 - INSERIR")
        print("2 - EXCLUIR")
        print("3 - EXIBIR")
        print("4 - EXIBIR POR ID")
        print("5 - IMAGEM ASCII")
        print("6 - ANIMAÇÃO ASCII")
        print("0 - SAIR")

        try:
            opcao = input("Escolha uma opção: ")
        except ValueError:
            print("Opção inválida. Digite um número do menu.")
            continue

        if opcao == "1" or opcao == "inserir":
            inserir()
        elif opcao == "2" or opcao == "excluir":
            excluir()
        elif opcao == "3" or opcao == "exibir":
            exibir()
        elif opcao == "4" or opcao == "exibir_por_id":
            exibir_por_id()
        elif opcao == "5" or opcao == "imagem_ascii":
            imagem_ascii()
        elif opcao == "6" or opcao == "animacao_ascii_legal":
            animacao_ascii_legal()
        elif opcao == "0" or opcao == "sair":
            print("Programa encerrado.")
            break
        else:
            print("Opção inválida.")


if __name__ == "__main__":
    menu()
