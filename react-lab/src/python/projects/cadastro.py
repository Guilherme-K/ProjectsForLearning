"""Cadastro simples em memória, com menu interativo.

Os dados existem apenas enquanto o programa está rodando.
"""

registros = [
    {"id": 1, "nome": "Ana", "idade": 22},
    {"id": 2, "nome": "Bruno", "idade": 31},
]


def listar():
    print("\n--- Pessoas cadastradas ---")
    if not registros:
        print("Nenhum registro encontrado.")
        return

    for registro in registros:
        print(f'#{registro["id"]:>2}  {registro["nome"]}  ({registro["idade"]} anos)')

    print(f"Total: {len(registros)} registro(s).")


def adicionar():
    nome = input("Nome: ").strip()
    if not nome:
        print("O nome não pode ficar vazio.")
        return

    idade_texto = input("Idade: ").strip()
    if not idade_texto.isdigit():
        print("A idade precisa ser um número inteiro.")
        return

    proximo_id = max((registro["id"] for registro in registros), default=0) + 1
    registros.append({"id": proximo_id, "nome": nome, "idade": int(idade_texto)})
    print(f"Registro de {nome} criado com o ID {proximo_id}.")


def remover():
    listar()
    if not registros:
        return

    entrada = input("\nID que deseja remover: ").strip()
    if not entrada.isdigit():
        print("Digite um ID numérico.")
        return

    identificador = int(entrada)
    for registro in registros:
        if registro["id"] == identificador:
            registros.remove(registro)
            print(f"Registro #{identificador} removido.")
            return

    print("ID não encontrado.")


print("=" * 46)
print("  Cadastro em memória")
print("=" * 46)

while True:
    print("\n1 - Listar  2 - Adicionar  3 - Remover  4 - Sair")
    opcao = input("Escolha uma opção: ").strip()

    if opcao == "1":
        listar()
    elif opcao == "2":
        adicionar()
    elif opcao == "3":
        remover()
    elif opcao == "4":
        print("Encerrando. Os dados foram perdidos, pois ficam em memória.")
        break
    else:
        print("Opção inválida.")
