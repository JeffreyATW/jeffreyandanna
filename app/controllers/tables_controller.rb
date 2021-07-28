require 'rabl'
class TablesController < ApplicationController
  before_action :authenticate_user!

  Rabl.configure do |config|
    config.include_json_root = false
    config.include_child_root = false
  end

  # GET /tables
  # GET /tables.json
  def index
    @title = 'Tables'
    @tables = Table.all

    respond_to do |format|
      format.html {
        @tables_rabl = Rabl.render(@tables, 'tables/index', view_path: 'app/views', format: 'json')
        @guests_rabl = Rabl.render(Guest.attending, 'tables/guests', view_path: 'app/views', format: 'json')
      }
      format.json { render json: @tables }
    end
  end

  # GET /tables/1
  # GET /tables/1.json
  def show
    @table = Table.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @table }
    end
  end

  # GET /tables/new
  # GET /tables/new.json
  def new
    @table = Table.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @table }
    end
  end

  # GET /tables/1/edit
  def edit
    @table = Table.find(params[:id])
  end

  # POST /tables
  # POST /tables.json
  def create
    @table = Table.new(params[:table].permit(:name, :notes, :x, :y, :table_type, :guest_ids => []))

    respond_to do |format|
      if @table.save
        format.html { redirect_to @table, notice: 'Table was successfully created.' }
        format.json { render 'tables/create', status: :created, location: @table }
      else
        format.html { render action: "new" }
        format.json { render json: @table.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /tables/1
  # PUT /tables/1.json
  def update
    @table = Table.find(params[:id])

    respond_to do |format|
      if @table.update_attributes(params[:table].permit(:name, :notes, :x, :y, :table_type, :guest_ids => []))
        format.html { redirect_to @table, notice: 'Table was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @table.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tables/1
  # DELETE /tables/1.json
  def destroy
    @table = Table.find(params[:id])
    @table.destroy

    respond_to do |format|
      format.html { redirect_to tables_url }
      format.json { head :no_content }
    end
  end
end
